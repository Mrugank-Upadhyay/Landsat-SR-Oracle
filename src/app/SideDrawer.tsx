import { Drawer, Divider, Box, CssBaseline, Toolbar, List } from "@mui/material";

const drawerWidth = 240;

export default function SideDrawer() {
    return (
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column'}}>
            <CssBaseline />
            <Drawer 
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar />
                <Divider />
                <List>
                    
                </List>

            </Drawer>
        </Box>
    )
}