import React, {useState, useContext} from "react";
import Card from "../../shared/components/UIElements/Card/Card";
import Input from "../../shared/components/FormElements/Input/Input";
import Button from "../../shared/components/FormElements/Button";
import {useForm} from "../../shared/hoooks/form-hook";
import {AuthContext} from "../../shared/context/auth-context";

import './Auth.css';
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
} from "../../shared/components/Utils/validators";
const Auth = props => {
    const [isLogin, setIsLogin] = useState(true);
    const auth = useContext(AuthContext);

   const[formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false)


    const authSubmitHandler = event => {
       event.preventDefault();
       console.log(formState.inputs)
        auth.login();
    };

   const switchSignInHandler = event => {
        if(!isLogin) {
            setFormData({
                ...formState.inputs,
                    name: undefined
                },
                formState.inputs.email.isValid &&
                formState.inputs.password.isValid)
        }else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                }
            },false)
        }

        setIsLogin(prevMode=> !prevMode);
   }

    return <Card className="authentication">
        <h2> {isLogin ? 'LOGIN' : 'SIGN-UP'}</h2>
        <hr/>
        <form onSubmit={authSubmitHandler}>
            {!isLogin &&
            <Input
                id="name"
                element='input'
                type='text'
                label='Full Name'
                validators={[VALIDATOR_REQUIRE()]}
                onInput={inputHandler}
                errorText="Please enter full name."/>
            }
            <Input
                id="email"
                element='input'
                type='email'
                label='Email'
                validators={[VALIDATOR_EMAIL()]}
                onInput={inputHandler}
                errorText="Please enter a valid email."/>

            <Input
                id="password"
                element='input'
                type='password'
                label='Password'
                validators={[VALIDATOR_MINLENGTH(5)]}
                onInput={inputHandler}
                errorText="Please enter a valid password, at least 5 characters."/>
            <Button
                type="submit"
                disabled={!formState.isValid}>
                {isLogin ? 'LOGIN' : 'SIGN-UP'}
            </Button>
        </form>
        <Button
            inverse
            onClick={switchSignInHandler}>
            {isLogin ? 'SWITCH TO SIGN-UP' : 'SWITCH TO LOGIN'}
        </Button>
    </Card>
}

export default Auth;