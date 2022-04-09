import React, {useContext} from "react";
import Input from "../../shared/components/FormElements/Input/Input";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../shared/components/Utils/validators";
import Button from "../../shared/components/FormElements/Button";
import {useForm} from "../../shared/hoooks/form-hook";
import {useHttpClient} from "../../shared/hoooks/http-hook";
import {AuthContext} from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/Error/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/Loading/LoadingSpinner";
import {useHistory} from "react-router-dom";
import './PostForm.css';


const NewAdminPost = () => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const auth = useContext(AuthContext)

    const [formState, inputChangeHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
    },false)

    const history = useHistory();

    const placeSubmitHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(`http://localhost:5000/api/admin/post`,
                'POST',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description : formState.inputs.description.value,
                }),
                {'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token}
            )
            history.push('/'); // redirect
        }catch (e) {

        }

    }

    return <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        <form className="place-form" onSubmit={placeSubmitHandler}>
            {isLoading && <LoadingSpinner asOverlay/>}
            <Input
                id="title"
                element='input'
                type='text'
                label='Title'
                validators={[VALIDATOR_REQUIRE()]}
                onInput={inputChangeHandler}
                errorText="Please enter a valid title"/>

            <Input
                id="description"
                element='textarea'
                label='Description'
                validators={[VALIDATOR_MINLENGTH(5)]}
                onInput={inputChangeHandler}
                errorText="Please enter a valid description."/>

            <Button type="submit" disabled={!formState.isValid}>ADD POST</Button>
        </form>
    </React.Fragment>

};

export default NewAdminPost;