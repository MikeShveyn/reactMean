import React, {useState, useContext} from "react";
import Card from "../../shared/components/UIElements/Card/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal/Modal";
import Map from "../../shared/components/UIElements/Map/Map";
import {AuthContext} from "../../shared/context/auth-context";


import './PostItem.css'
import {useHttpClient} from "../../shared/hoooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/Error/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/Loading/LoadingSpinner";


const PostItem = props => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const auth = useContext(AuthContext);
    const [showMap, setShowMap] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () => setShowMap(false);
    const openConfirmHandler = () => setShowConfirm(true);
    const closeConfirmHandler = () => setShowConfirm(false);
    const confirmDeleteHandler = async () => {
        closeConfirmHandler();
        try {
            await sendRequest(`http://localhost:5000/api/posts/${props.id}`,
                'DELETE',
                null,
                {Authorization: 'Bearer ' + auth.token}
            )
            props.onDelete(props.id);
        }catch (e) {

        }
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Modal
                show={showMap}
                onCancel={closeMapHandler}
                header={props.address}
                contentClass="place-item-modal-content"
                footerClass="place-item-modal-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}>
              <div className="map-container">
                    <Map center={props.coordinate} zoom={16}/>
              </div>
            </Modal>

            <Modal
                show={showConfirm}
                onCancel={closeConfirmHandler}
                header="Delete your place?"
                contentClass="place-item-modal-content"
                footerClass="place-item-modal-actions"
                footer={
                    <React.Fragment>
                        <Button inverse onClick={closeConfirmHandler}>Cancel</Button>
                        <Button  danger onClick={confirmDeleteHandler}>DELETE</Button>
                    </React.Fragment>
                }>
                <p>Post can't be restored</p>
            </Modal>

            <li className='place-item'>
                <Card className='place-item-content'>
                    {isLoading && <LoadingSpinner asOverlay/>}
                    <div className='place-item-image'>
                        <img src={props.image} alt={props.title}/>
                    </div>
                    <div className='place-item-info'>
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className='place-item-actions'>
                        <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                        {auth.userId === props.creatorId &&  <Button to={`/posts/${props.id}`}>EDIT</Button>}
                        {auth.userId === props.creatorId && <Button danger onClick={openConfirmHandler}>DELETE</Button>}
                    </div>
                </Card>
            </li>
        </React.Fragment>
    )
}

export default PostItem;