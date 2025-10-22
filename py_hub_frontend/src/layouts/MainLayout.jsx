import { AppBar, Toolbar, Button, Container } from "@mui/material";
import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
    return (
        <>
        <AppBar position="static">
            <Toolbar>
                <Button component={Link} to="/" color="inherit">Home</Button>
                <Button component={Link} to="/about" color="inherit">About</Button>
            </Toolbar>
        </AppBar>
        <Container sx={{mt:4}}>
            <Outlet></Outlet>
        </Container>
        </>
    )
}

// import { Outlet, Link } from 'react-router-dom';
// import { AppBar, Toolbar, Button, Container } from '@mui/material';

// export default function MainLayout() {
//   return (
//     <>
//       <AppBar position="static">
//         <Toolbar>
//           <Button component={Link} to="/" color="inherit">Home</Button>
//           <Button component={Link} to="/about" color="inherit">About</Button>
//         </Toolbar>
//       </AppBar>
//       <Container sx={{ mt: 4 }}>
//         <Outlet />
//       </Container>
//     </>
//   );
// }