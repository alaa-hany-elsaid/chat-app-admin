import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {invokeToken} from "../state/slices/authSlice";

export function isNormal() {
    const is_authenticated = useSelector((state) => state.auth.is_authenticated)
    const role = useSelector((state) => state.auth.userData.role)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    if (!is_authenticated || role !== 'normal') {
        dispatch(invokeToken())
        navigate('/');
    }
}