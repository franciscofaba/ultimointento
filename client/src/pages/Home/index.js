import React from "react";
import styles from "./styles.module.css";
import Top from "../../shared/top_login";
import profile from "../../images/profile.jpg";

function Home({ userDetails }) {
    const { user } = userDetails;

    const logout = () => {
        window.open(`http://127.0.0.1:8080/auth/logout`, "_self");
    };

    return (
        <>
            <Top />
            <div className={styles.container}>
                <h1 className={styles.heading}>Home</h1>
                <div className={styles.form_container}>
                    <div className={styles.left}>
                        <img className={styles.img} src={profile} alt="login" />
                    </div>
                    <div className={styles.right}>
                        <h2 className={styles.from_heading}>Profile</h2>
                        <img src={user.picture} alt="profile" className={styles.profile_img} />
                        <input
                            type="text"
                            defaultValue={user.name}
                            className={styles.input}
                            placeholder="UserName"
                        />
                        <input
                            type="text"
                            defaultValue={user.email}
                            className={styles.input}
                            placeholder="Email"
                        />
                        <button className={styles.btn} onClick={logout}>
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
