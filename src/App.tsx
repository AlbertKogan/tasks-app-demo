import { Fragment } from 'react';

import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';

function App() {
  return (
    <Fragment>
      <CssBaseline />
      <Typography component="div"
                  style={{ backgroundColor: '#cfe8fc', height: '100vh' }}>
        Initial Template
      </Typography>
    </Fragment>
  );
}

export default App;
