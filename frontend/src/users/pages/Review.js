import {useForm} from "../../shared/hoooks/form-hook";
import React from "react";
import {useHistory} from "react-router-dom";
import {useHttpClient} from "../../shared/hoooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/Loading/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/Error/ErrorModal";
import Button from "../../shared/components/FormElements/Button";
import '../../posts/pages/PostForm.css';
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../shared/components/Utils/validators";
import Input from "../../shared/components/FormElements/Input/Input";

const Review = () => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const history = useHistory();

    const [formState, inputHandler, setFormData] = useForm({
        name: {
            value: '',
            isValid: true
        },
        description: {
            value: '',
            isValid: true
        }
    }, true)

    const reviewSubmitHandler = async event => {
        event.preventDefault();
        try {
            window.open(`mailto:test@example.com?subject=subject&body=${
                ' Name: ' + formState.inputs.name.value + ' Topic: ' +
                formState.inputs.description.value
            }`);
            history.push('/');
        }catch (e) {

        }

    }

    if(isLoading) {
        return <div className="center">
            <LoadingSpinner/>
        </div>
    }

    return <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        {!isLoading && <form className='place-form' onSubmit={reviewSubmitHandler}>
            <Input
                id="name"
                element='input'
                label='Name'
                validators={[VALIDATOR_MINLENGTH(5)]}
                onInput={inputHandler}
                errorText="Please enter a valid name."/>

            <Input
                id="description"
                element='textarea'
                label='Description'
                validators={[VALIDATOR_MINLENGTH(15)]}
                onInput={inputHandler}
                errorText="Please enter description at least 15 characters."/>

            <Button type="submit" disabled={!formState.isValid}>SEND REVIEW</Button>
        </form>}
    </React.Fragment>

}

export default Review;