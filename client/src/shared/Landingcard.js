import React from 'react'
import { Segment, Header} from 'semantic-ui-react'
import { useTranslation } from "react-i18next";

const Landingcard = () => { 
    const [t, i18n] = useTranslation("global");
    return (           
        <div >
            <Segment  >
                <Header as='h3' dividing>{t("portal.t1")}</Header>
                <p>{t("portal.t2")}</p>
            </Segment>
        </div>
    );
};

export default Landingcard;
