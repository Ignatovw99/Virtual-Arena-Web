import { useEffect, useState } from "react";

import { useAuth0 } from "@auth0/auth0-react";

import { ErrorAlert } from "../../components/Alert";
import useUserApi from "../../hooks/useUserApi";
import useAlert from "../../hooks/useAlert";

const useAuthenticatedUserApi = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, isLoading: isAuthLoading, getIdTokenClaims } = useAuth0();
    const { getUserProfile, createUserProfile } = useUserApi({
        excludeLoading: true,
        excludeError: true,
        excludeAlert: true
    });
    const { alert, showAlert } = useAlert();

    useEffect(() => {
        if (isAuthLoading) {
            return;
        }

        (async () => {
            if (isAuthenticated) {
                await loadAuthenticatedUserProfile();
            }
            setLoading(false);
        })();

        // eslint-disable-next-line
    }, [isAuthLoading, isAuthenticated]);

    const createNewUserProfile = async () => {
        try {
            const idTokenClaims = await getIdTokenClaims();
            return await createUserProfile(idTokenClaims);
        } catch (err) {
            showAlert(ErrorAlert, err.message);
        }
    };

    const loadAuthenticatedUserProfile = async () => {
        try {
            const userProfile = await getUserProfile();
            setUser(userProfile);
        } catch {
            const createdUser = createNewUserProfile();
            if (!createdUser) {
                return;
            }
            setUser(createdUser);
        }
    };

    return { user, loading, alert };
};

export default useAuthenticatedUserApi;
