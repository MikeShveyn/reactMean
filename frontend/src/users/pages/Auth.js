import React, {useState, useContext} from "react";
import Card from "../../shared/components/UIElements/Card/Card";
import Input from "../../shared/components/FormElements/Input/Input";
import Button from "../../shared/components/FormElements/Button";
import {useForm} from "../../shared/hoooks/form-hook";
import {AuthContext} from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/Error/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/Loading/LoadingSpinner";
import {useHttpClient} from "../../shared/hoooks/http-hook";
import './Auth.css';
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
} from "../../shared/components/Utils/validators";
const Auth = props => {
    const auth = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

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


    const authSubmitHandler = async event => {
       event.preventDefault();

       if(isLogin) {
           try {
               const data = await sendRequest(`http://localhost:5000/api/users/login`,
                   'POST',
                   JSON.stringify({
                       email: formState.inputs.email.value,
                       password: formState.inputs.password.value,
                   }),
                   {
                       'Content-Type': 'application/json'
                   }
                   );

               auth.login(data.user.id);
           } catch (e) {

           }
       }else {
           try {
                const data = await sendRequest(`http://localhost:5000/api/users/signup`,
                        'POST',
                        JSON.stringify({
                            name: formState.inputs.name.value,
                            email: formState.inputs.email.value,
                            password: formState.inputs.password.value,
                        }),
                          {
                               'Content-Type': 'application/json'
                           }
                )
               auth.login(data.user.id);
           }catch (e) {
           }

       }

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

    return <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        <Card className="authentication">
            {isLoading && <LoadingSpinner asOverlay={true}/>}
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
                    validators={[VALIDATOR_MINLENGTH(6)]}
                    onInput={inputHandler}
                    errorText="Please enter a valid password, at least 6 characters."/>
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
    </React.Fragment>


}

export default Auth;