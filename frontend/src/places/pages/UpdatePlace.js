import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {dummyPlaces} from "./UserPlaces";
import Input from "../../shared/components/FormElements/Input/Input";
import Button from "../../shared/components/FormElements/Button";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../shared/components/Utils/validators";
import {useForm} from "../../shared/hoooks/form-hook";
import Card from "../../shared/components/UIElements/Card/Card";

import './PlaceForm.css';

const UpdatePlace = () => {
    const [isLoading, setIsLoading] = useState(true);
    const placeId = useParams().placeId;

    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: true
        },
        description: {
            value: '',
            isValid: true
        }
    }, true)

    const placeUpdateSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);
    }

    const relevantPlace = dummyPlaces.find(p => p.id === placeId);

    useEffect(() => {
        if(relevantPlace) {
            setFormData(
                {
                    title: {
                        value: relevantPlace.title.value,
                        isValid: true
                    },
                    description: {
                        value: relevantPlace.description.value,
                        isValid: true
                    }
                },true)
        }
        setIsLoading(false);
    },[setFormData, relevantPlace])


    if(!relevantPlace){
        return <div className="center">
            <Card>
                <h2>Couldn't fetch place</h2>
            </Card>
        </div>
    }

    if(isLoading) {
        return <div className="center">
            <h2>Loading</h2>
        </div>
    }


    return <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
            <Input
                id="title"
                element='input'
                type='text'
                label='Title'
                validators={[VALIDATOR_REQUIRE()]}
                onInput={inputHandler}
                initialValue={formState.inputs.title.value}
                initialIsValid={formState.inputs.title.valid}
                errorText="Please enter a valid title"/>

            <Input
                id="description"
                element='textarea'
                label='Description'
                validators={[VALIDATOR_MINLENGTH(5)]}
                onInput={inputHandler}
                initialValue={formState.inputs.description.value}
                initialIsValid={formState.inputs.description.valid}
                errorText="Please enter a valid description."/>

            <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
        </form>
}

export default UpdatePlace;