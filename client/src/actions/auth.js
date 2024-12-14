import { toast } from 'react-toastify'
import * as api from '../api/index'
import { AUTH, CREATE_PROFILE } from './constants'


export const signin =(formData, history, setLoading) => async(dispatch) => {

    try {
        //login the user
        const { data } = await api.signIn(formData)

        dispatch({ type: AUTH, data})
        // setLoading(false)
        toast.success("Signin successfull")
        history('/dashboard')
        // window.location.href="/dashboard"

    } catch (error) {
        // console.log(error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
        setLoading(false)
    }
}

export const signup =(formData, history, setLoading) => async(dispatch) => {

    try {
        //Sign up the user
        const { data } = await api.signUp(formData)
        dispatch({ type: AUTH, data})
        const { info } = await api.createProfile({name: data?.result?.name, email: data?.result?.email, userId: data?.result?._id, phoneNumber: '', businessName: '', contactAddress: '', logo: '', website: ''});
        dispatch({ type: CREATE_PROFILE, payload: info });
        // window.location.href="/dashboard"
        history('/dashboard');
        toast.success("Sign up successfull")

    } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message)
        setLoading(false)
    }
}



export const forgot =(formData) => async(dispatch) => {
    try {
        await api.forgot(formData)
    } catch (error) {
        console.log(error)
    }
}


export const reset =(formData, history) => async(dispatch) => {

    try {
        await api.reset(formData)
        history('/dashboard')

    } catch (error) {
        alert(error)
    }
}
