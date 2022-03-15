import React from "react";
import Input from "../../shared/components/FormElements/Input/Input";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../shared/components/Utils/validators";
import Button from "../../shared/components/FormElements/Button";
import {useForm} from "../../shared/hoooks/form-hook";

import './PlaceForm.css';


const NewPlace = () => {
    const [formState, inputChangeHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        }
    },false)


   const placeSubmitHandler = event => {
       event.preventDefault();
       console.log(formState.inputs);
   }

    return <form className="place-form" onSubmit={placeSubmitHandler}>
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

        <Input
            id="address"
            element='input'
            label='Address'
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputChangeHandler}
            errorText="Please enter a valid address"/>

        <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
    </form>
};

export default NewPlace;