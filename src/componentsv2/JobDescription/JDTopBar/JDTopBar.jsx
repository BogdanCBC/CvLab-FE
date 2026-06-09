import { Box, Button, Tooltip, IconButton, Typography } from '@mui/material';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import "./JDTopBar.css"
import {useTranslation} from "react-i18next";

export default function JDTopBar({setUploadNew}){
    const {t} = useTranslation();

    const renderTooltipContent = () => (
        <>
        <Typography
            variant="subtitle2"
            sx={{ fontWeight: 'bold', mb: 0.2, textAlign: "justify" }}
        >
            {t("jdTopBar.pageTitle")}:
        </Typography>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', textAlign: "justify" }}>
            <li style={{ marginBottom: "0.2rem"}}>{t("jdTopBar.view")}</li>
            <li style={{ marginBottom: "0.2rem"}}>{t("jdTopBar.click")}</li>
            <li style={{ marginBottom: "0.2rem"}}>{t("jdTopBar.select")}</li>
            <li style={{ marginBottom: "0.2rem"}}>{t("jdTopBar.use")}</li>
        </ul>
        </>
)

    return (
        <div className="job-top-bar">
            <Box
                display="flex"
                justifyContent="space-between"
            >
                <h1 className="h1-component">{t("jdTopBar.pageTitle")}</h1>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Tooltip title={renderTooltipContent()} sx={{mr: 2}}>
                            <IconButton>
                                <InfoOutlineIcon/>
                            </IconButton>
                        </Tooltip>
                        
                        <Button
                            variant="contained"
                            onClick={() => setUploadNew(true)}
                            startIcon={<AddCircleOutlineIcon />}
                        >
                            {t("jdTopBar.uploadNew")}
                        </Button>
                    </Box>
            </Box>
        </div>
    )
}