import React, { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; 
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signup, signin } from '../../actions/auth';
import { createProfile } from '../../actions/profile';
import CircularProgress from '@mui/material/CircularProgress';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Field from './Field';
import styles from './Login.module.css';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '', profilePicture: '', bio: '' };

const Login = () => {
    const [formData, setFormData] = useState(initialState);
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const history = useNavigate();
 

    const handleShowPassword = () => setShowPassword(!showPassword);
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignup) {
            dispatch(signup(formData, history, setLoading));
        } else {
            dispatch(signin(formData, history, setLoading));
        }
        setLoading(true);
    };
    const switchMode = () => setIsSignup((prevState) => !prevState);

    const googleSuccess = async (res) => {
        const result = jwtDecode(res.credential);
        const token = res?.credential;
        dispatch(createProfile({
            name: result?.name, email: result?.email, userId: result?.jti,
            phoneNumber: '', businessName: '', contactAddress: '', logo: result?.picture, website: ''
        }));
        try {
            dispatch({ type: "AUTH", data: { result, token } });
     
        } catch (error) {
            console.log(error);
        }
    };

    const googleError = (error) => {
        console.log(error);
        console.log("Google Sign In was unsuccessful. Try again later");
    };

    const user = JSON.parse(localStorage.getItem('profile'));
    if (user) {
        history('/dashboard');
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={2} sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 0
            }}>
                <Avatar sx={{ margin: 1, backgroundColor: '#1976d2' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {isSignup ? 'Sign up' : 'Sign in'}
                </Typography>
                <form onSubmit={handleSubmit} sx={{ width: '100%', marginTop: 3 }}>
                    <Grid container spacing={2}>
                        {isSignup && (
                            <>
                                <Field name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                <Field name="lastName" label="Last Name" handleChange={handleChange} half />
                            </>
                        )}
                        <Field name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Field name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                        {isSignup && <Field name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
                    </Grid>
                    <div className={styles.buttons}>
                        <div>
                            {loading ? <CircularProgress />
                                : <button className={styles.loginBtn}>{isSignup ? 'Sign Up' : 'Sign In'}</button>}
                        </div>
                        <div className={styles.option}>
                            <span>or</span>
                        </div>
                        <div>
                            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                                <GoogleLogin
                                    onSuccess={googleSuccess}
                                    onError={googleError}
                                    text='continue_with'
                                    useOneTap
                                    auto_select
                                    state_cookie_domain='single_host_origin'
                                />
                            </GoogleOAuthProvider>
                        </div>
                    </div>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up"}
                            </Button>
                        </Grid>
                    </Grid>
                    <Link to="forgot"><p style={{ textAlign: 'center', color: '#1d7dd6', marginTop: '20px' }}>Forgotten Password?</p></Link>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;
