import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import "./FeelIt.css"

export default function FeelIt(props) {
    return (
        <div className="feel-it">
            <div className="feel-it-header">
                <h2 sx={{fontSize: 30}}>FeelIT projects</h2>
                <Button
                    className = "add-feel-it-client-button"
                    variant = "contained"
                    size = "small"
                    sx = {{margin: 1, marginBottom: 2}}
                    onClick={() => props.addFeelItClient()}
                > <AddIcon />Add FeelIT client</Button>
            </div>

            {props.profileData.feel_it.map((client, index) => (
                <div key={index} className="client-item">
                    <div className="client-item-header">
                        <h3>Client {client.client_name || ""}</h3> 
                        <Button
                            variant="contained"
                            size="small"
                            sx={{margin: 1, marginBottom: 2}}
                            onClick={() => props.removeFeelItClient(index)}
                        >
                            <DeleteIcon />
                        </Button>
                    </div>

                    <TextField 
                        label="client_name"
                        multiline
                        value={client.client_name || ""}
                        onChange={(e) => {
                            props.updateFeelItClient(index, "client_name", e.target.value)
                        }} 
                    />

                    <TextField 
                        label="client_description"
                        multiline
                        value={client.client_description || ""}
                        onChange={(e) => {
                            props.updateFeelItClient(index, "client_description", e.target.value)
                        }} 
                    />

                    <TextField 
                        label="link"
                        multiline
                        value={client.link || ""}
                        onChange={(e) => {
                            props.updateFeelItClient(index, "link", e.target.value)
                        }} 
                    />

                    <div className="responsibilities">
                        <div className="responsibilities-header">
                            <h3>Responsibilities</h3>
                            <Button
                                variant="text"
                                size="small"
                                sx={{ margin: 1, marginBottom: 2, color: 'primary.main' }}
                                onClick={() => props.addFeelItResponsibility(index)}
                                startIcon={<AddIcon />}
                            >
                                Add Responsibility
                            </Button>
                        </div>

                        {client.responsibilities && client.responsibilities.map((resp, respIndex) => (
                            <div className="responsibility-item" key={respIndex}>
                                <TextField
                                    key={respIndex}
                                    label={`Responsibility ${respIndex + 1}`}
                                    multiline
                                    value={resp || ""}
                                    onChange={(e) => {
                                        props.updateFeelItResponsibility(index, respIndex, e.target.value);
                                    }}
                                    fullWidth
                                />

                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{margin: 1, marginBottom: 2}}
                                    onClick={() => props.removeFeelItResponsibility(index, respIndex)}
                                >
                                    <DeleteIcon />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}