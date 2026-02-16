import { Box, Button, Stack, Typography } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import React from "react";
import {useTranslation} from "react-i18next";

export default function NothingSelected({setUploadNew}) {
    const {t} = useTranslation();

    return(
        <Box 
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: 400 }}
        >
            <Stack spacing={2} alignItems="center">
                <InfoOutlinedIcon color="action" sx={{ fontSize: 40 }} />
                <Typography variant="h6" color="text.primary">
                    {t("jdNothingSelected.message")}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {t("jdNothingSelected.createNew")}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => setUploadNew(true)}
                    sx={{ mt: 2 }}
                >
                    {t("jdNothingSelected.createBtn")}
                </Button>
            </Stack>
        </Box>
    );
}