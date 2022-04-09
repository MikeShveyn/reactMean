import React, {useState, useContext} from "react";
import Card from "../../shared/components/UIElements/Card/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal/Modal";

import {AuthContext} from "../../shared/context/auth-context";

import './PostItem.css'
import {useHttpClient} from "../../shared/hoooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/Error/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/Loading/LoadingSpinner";
import {useHistory} from "react-router-dom";



const AdminPostItem = props => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const auth = useContext(AuthContext);
    const [showConfirm, setShowConfirm] = useState(false);

    const history = useHistory();
    const openConfirmHandler = () => setShowConfirm(true);
    const closeConfirmHandler = () => setShowConfirm(false);
    const confirmDeleteHandler = async () => {
        closeConfirmHandler();
        try {
            await sendRequest(`http://localhost:5000/api/admin/post/${props.id}`,
                'DELETE',
                null,
                {Authorization: 'Bearer ' + auth.token}
            )
        }catch (e) {

        }finally {
            history.push('/'); // redirect
            history.go(0)

        }
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />

            <Modal
                show={showConfirm}
                onCancel={closeConfirmHandler}
                header="Delete your post?"
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

                <Card className='place-item-content'>
                    {isLoading && <LoadingSpinner asOverlay/>}
                    <div className='place-item-info'>
                        <h2>{props.title}</h2>
                        <p>{props.description}</p>
                    </div>
                    <div className='place-item-image'>
                        <img src={props.image} alt={props.title}/>
                    </div>
                    <div className='place-item-actions'>
                        {auth.isAdmin &&  <Button to={`/posts/${props.id}`}>EDIT</Button>}
                        {auth.isAdmin && <Button danger onClick={openConfirmHandler}>DELETE</Button>}
                    </div>
                </Card>
        </React.Fragment>
    )
}

export default AdminPostItem;