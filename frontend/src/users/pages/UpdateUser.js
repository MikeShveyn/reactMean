import React, {useContext, useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import Input from "../../shared/components/FormElements/Input/Input";
import Button from "../../shared/components/FormElements/Button";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../shared/components/Utils/validators";
import {useForm} from "../../shared/hoooks/form-hook";
import Card from "../../shared/components/UIElements/Card/Card";

import '../../posts/pages/PostForm.css';
import {useHttpClient} from "../../shared/hoooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/Loading/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/Error/ErrorModal";
import {AuthContext} from "../../shared/context/auth-context";

const UpdateUser = () => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedUser, setLoadedUser] = useState();
    const userId = useParams().userId;
    const auth = useContext(AuthContext)
    const history = useHistory();

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: true
        },
        name: {
            value: '',
            isValid: true
        }
    }, true)

    const placeUpdateSubmitHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(`http://localhost:5000/api/users/${userId}`,
                'PATCH',
                JSON.stringify({
                    email: formState.inputs.email.value,
                    name : formState.inputs.name.value,
                }),
                {'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token}
            )
            history.push('/users/' + auth.userId);
        }catch (e) {

        }

    }

    useEffect(() => {
        const fetchUser = async() => {
            try {
                const data = await  sendRequest(`http://localhost:5000/api/users/${auth.userId}`,
                    'GET',
                    null,
                    {Authorization: 'Bearer ' + auth.token});
                setLoadedUser(data.user);

                setFormData(
                    {
                        email: {
                            value: data.user.email,
                            isValid: true
                        },
                        name: {
                            value: data.user.name,
                            isValid: true
                        }
                    },true)
            }
            catch (e) {

            }
        }
        fetchUser();
    },[setFormData, userId, sendRequest])


    if(isLoading) {
        return <div className="center">
            <LoadingSpinner/>
        </div>
    }

    if(!loadedUser && !error){
        return <div className="center">
            <Card>
                <h2>Couldn't fetch user</h2>
            </Card>
        </div>
    }



    return <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        {!isLoading && loadedUser && <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
            <Input
                id="email"
                element='input'
                type='text'
                label='Email'
                validators={[VALIDATOR_REQUIRE()]}
                onInput={inputHandler}
                initialValue={loadedUser.email}
                initialIsValid={true}
                errorText="Please enter a valid email"/>

            <Input
                id="name"
                element='textarea'
                label='Name'
                validators={[VALIDATOR_MINLENGTH(5)]}
                onInput={inputHandler}
                initialValue={loadedUser.name}
                initialIsValid={true}
                errorText="Please enter a valid name."/>

            <Button type="submit" disabled={!formState.isValid}>UPDATE USER</Button>
        </form>}
    </React.Fragment>

}

export default UpdateUser;