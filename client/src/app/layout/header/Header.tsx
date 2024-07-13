import { AppBar, Box, Toolbar, IconButton, Typography, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Select, MenuItem } from '@mui/material';
import { Adb as AdbIcon, Menu as MenuIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useStats } from '@/utils/StatsContext';

const drawerWidth = 240;
const menuItems = [
  { title: "Overview", href: "/", },
  { title: "Matches", href: "/matches", },
  { title: "Group stage", href: "/group", },
  { title: "Knockout stage", href: "/knockout", },
  { title: "Custom Match", href: "/custom", },
];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const { year, setYear } = useStats();

  return (
    <>
      <Box px={2} display="flex" justifyContent="space-between" width="100%" color="white" bgcolor="black">
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
          <Typography pb={0.2} variant="body1">
            EURO
          </Typography>
          <Select
            variant="outlined"
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            sx={{
              color: 'white', borderColor: 'white', height: '32px',
              '.MuiOutlinedInput-input': { paddingLeft: '4px' },
              '.MuiSvgIcon-root': { fontSize: '1rem' },
              '.MuiSelect-icon': { color: 'white' },
            }}
          >
            {Array.from({ length: (2024 - 1960) / 4 + 1 }, (_, index) => 2024 - index * 4).map(year => (
              <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
            ))}
          </Select>
        </Box>
        <Select variant="outlined" value={language} onChange={(event) => setLanguage(event.target.value as string)}
          sx={{
            color: 'white', borderColor: 'white', height: '32px',
            '.MuiSvgIcon-root': { fontSize: '1rem' },
            '.MuiSelect-icon': { color: 'white' },
          }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="fr">Français</MenuItem>
          <MenuItem value="de">Deutsch</MenuItem>
        </Select>
      </Box>
      <AppBar component="nav" position="sticky">
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={() => setMobileOpen((prevState) => !prevState)} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' } }}>
          </Box>
          <AdbIcon sx={{ mr: 1 }} />
          <Typography variant="h5" noWrap component="a" href="/" sx={{ mr: 2, display: { xs: 'flex', sm: 'flex' }, flexGrow: { xs: 1, sm: 0 }, fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none' }}>
            Footy AI
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
            {menuItems.map((item) => (
              <Button key={item.title} href={item.href} sx={{ my: 2, color: 'white', display: 'block' }}>
                {item.title}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer variant="temporary" open={mobileOpen} onClick={() => setMobileOpen((prevState) => !prevState)} ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <Box onClick={() => setMobileOpen((prevState) => !prevState)} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
              MUI
            </Typography>
            <Divider />
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.title} disablePadding>
                  <ListItemButton href={item.href} sx={{ textAlign: 'center' }}>
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </nav>
    </>
  );
}
export default Header;
