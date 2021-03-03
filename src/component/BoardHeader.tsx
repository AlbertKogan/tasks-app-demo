import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import { Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

export default function BoardHeader() {
  // TODO: fetch statuses
  const statuses = ["Candidates", "In progress", "QA", "Completed"];

  return (
    <Grid item xs={12}>
      <Grid container justify="space-between" spacing={2}>
        {statuses.map((value) => (
          <Grid key={value} item>
            <Box>
              <Typography>{value}</Typography>
              <IconButton size="small">
                <AddIcon />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
