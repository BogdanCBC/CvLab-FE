import React from "react"
import { Box, Typography, Stack, Button } from "@mui/material";

export default function ViewMode( {jobInfo, setEditMode} ) {

    return(
        <Box 
            display="flex"
            flexDirection="column" 
            justifyContent="space-around"
            gap={2}
        >
            <Typography variant="h5" component="div">
                {jobInfo.title}
            </Typography>
            <Typography sx={{ whiteSpace: 'pre-line' }}>
                {jobInfo.description}
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                    variant="contained"
                    onClick={() => setEditMode(true)}
                >
                    Edit
                </Button>
            </Stack>
        </Box>
    );
}