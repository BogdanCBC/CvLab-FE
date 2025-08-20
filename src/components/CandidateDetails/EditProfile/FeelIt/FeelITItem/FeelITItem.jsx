import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AddIcon from "@mui/icons-material/Add"; // ← this was missing

export default function FeelITItem({
  client,
  index,
  updateFeelItClient,
  removeFeelItClient,
  addFeelItResponsibility,
  updateFeelItResponsibility,
  removeFeelItResponsibility,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: index.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div key={index} className="client-item">
        <IconButton
            size="small"
            sx={{ cursor: "grab", alignSelf: "flex-start" }}
            {...attributes}
            {...listeners}
        >
            <DragIndicatorIcon />
        </IconButton>

        <div className="client-item-header">
          <h3>Client {client.client_name || ""}</h3>
          <Button
            variant="contained"
            size="small"
            sx={{ margin: 1, marginBottom: 2 }}
            onClick={() => removeFeelItClient(index)}
          >
            <DeleteIcon />
          </Button>
        </div>

        <TextField
          label="client_name"
          multiline
          value={client.client_name || ""}
          onChange={(e) => {
            updateFeelItClient(index, "client_name", e.target.value);
          }}
        />

        <TextField
          label="client_description"
          multiline
          value={client.client_description || ""}
          onChange={(e) => {
            updateFeelItClient(index, "client_description", e.target.value);
          }}
        />

        <TextField
          label="link"
          multiline
          value={client.link || ""}
          onChange={(e) => {
            updateFeelItClient(index, "link", e.target.value);
          }}
        />

        <div className="responsibilities">
          <div className="responsibilities-header">
            <h3>Responsibilities</h3>
            <Button
              variant="text"
              size="small"
              sx={{ margin: 1, marginBottom: 2, color: "primary.main" }}
              onClick={() => addFeelItResponsibility(index)}
              startIcon={<AddIcon />}
            >
              Add Responsibility
            </Button>
          </div>

          {client.responsibilities &&
            client.responsibilities.map((resp, respIndex) => (
              <div className="responsibility-item" key={respIndex}>
                <TextField
                  key={respIndex}
                  label={`Responsibility ${respIndex + 1}`}
                  multiline
                  value={resp || ""}
                  onChange={(e) => {
                    updateFeelItResponsibility(index, respIndex, e.target.value);
                  }}
                  fullWidth
                />

                <Button
                  variant="outlined"
                  size="small"
                  sx={{ margin: 1, marginBottom: 2 }}
                  onClick={() =>
                    removeFeelItResponsibility(index, respIndex)
                  }
                >
                  <DeleteIcon />
                </Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
