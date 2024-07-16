import { AppBar, Box, Container, Toolbar, IconButton, Typography, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Select, MenuItem, SvgIcon, Fade, useMediaQuery, Menu, Collapse, SxProps, Theme } from '@mui/material';
import { ExpandLess, ExpandMore, Menu as MenuIcon } from '@mui/icons-material';
import { useEffect, useState, useRef } from 'react';
import { useStats } from '@/utils/StatsContext';
import { useLanguage } from '@/utils/LanguageProvider';
import { useIntl } from 'react-intl';
import { useTheme, lighten, darken } from '@mui/material/styles';
import Logo from '../shared/logo/Logo';
import EuroLogo from '../shared/logo/EuroLogo';

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  const { year, setYear } = useStats();
  const { language, setLanguage } = useLanguage();
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const isSmOrLarger = useMediaQuery(theme.breakpoints.up('sm'));

  const menuItems = [
    { title: formatMessage({ id: 'header.overview' }), href: "/", },
    {
      title: formatMessage({ id: 'header.fixtures' }),
      children: [
        { title: formatMessage({ id: 'header.allMatches' }), href: "/matches", },
        { title: formatMessage({ id: 'header.group' }), href: "/group", },
        { title: formatMessage({ id: 'header.knockout' }), href: "/knockout", },
      ],
    },
    { title: formatMessage({ id: 'header.custom' }), href: "/custom", },
  ];

  const handleClick = (title: string): void => {
    if (open === title) {
      setOpen(null);
    } else {
      setOpen(title);
    }
  };

  type DropdownMenuProps = {
    item: { title: string; href?: string; children?: Array<{ title: string; href: string; }>; };
    sx: SxProps<Theme>;
  };

  const DropdownMenu = ({ item, sx }: DropdownMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    return (
      <>
        <Button aria-controls={Boolean(anchorEl) ? 'menu-list-grow' : undefined} aria-haspopup="true" sx={sx}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)}>
          {item.title}
        </Button>
        <Menu id="menu-list-grow" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
          sx={{ '& .MuiPaper-root': { borderRadius: '0 !important', '& .MuiMenu-list': { padding: '0px !important' }, }, }}
        >
          {item.children?.map((child) => (
            <MenuItem sx={{ padding: '0px' }} key={child.title} onClick={() => setAnchorEl(null)}>
              <Button href={child.href} sx={{ ...sx, color: 'white', backgroundColor: 'primary.main' }} fullWidth>
                {child.title}
              </Button>
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  };


  useEffect(() => {
    const updateAppBarState = () => {
      const isAppBarStuck = !isSmOrLarger || window.scrollY > (document.getElementById('box-id')?.offsetHeight || 0);
      setIsStuck(isAppBarStuck);
    };
    updateAppBarState();
    window.addEventListener('scroll', updateAppBarState);
    return () => window.removeEventListener('scroll', updateAppBarState);
  }, [isSmOrLarger]);

  return (
    <>
      <Box id="box-id" py={2} color="white" sx={{ bgcolor: lighten(theme.palette.primary.main, 0.12), display: { xs: 'none', sm: 'flex' } }}>
        <Container sx={{ maxWidth: "1200px" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Box display="flex" alignItems="center" component="a" href="/" color="white" sx={{ textDecoration: 'none' }}>
              <SvgIcon component={Logo} sx={{ width: 68, height: 68, color: 'black', mr: 2 }} />
              <Typography fontFamily="Logo" className="custom-font-element" variant="h2" noWrap sx={{ color: 'inherit', lineHeight: 'normal', mt: '14px', }}>
                Footy AI
              </Typography>
            </Box>
            <Select variant="outlined" value={language} onChange={(event) => setLanguage(event.target.value as string)}
              sx={{ color: 'white', borderColor: 'white', height: '32px', '.MuiSvgIcon-root': { fontSize: '1rem' }, '.MuiSelect-icon': { color: 'white' }, '.MuiOutlinedInput-input': { paddingLeft: '4px', paddingRight: '24px !important' }, '&& fieldset': { border: 'none' }, }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="fr">Français</MenuItem>
              <MenuItem value="de">Deutsch</MenuItem>
            </Select>
          </Toolbar>
        </Container>
      </Box >
      <AppBar component="nav" position="sticky">
        <Container sx={{ maxWidth: "1200px" }}>
          <Toolbar variant='dense' ref={containerRef}>
            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={() => setMobileOpen((prevState) => !prevState)} sx={{ mr: 2, display: { sm: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Box display="flex" alignItems="center" component="a" href="/" color="white" sx={{ textDecoration: 'none' }}>
              <Fade in={isStuck}>
                <Box alignItems="center" sx={{ display: isStuck ? 'flex' : 'none' }}>
                  <SvgIcon component={Logo} sx={{ width: 40, height: 40, color: 'black', mr: 1 }} />
                  <Box sx={{ height: '24px', width: '1px', bgcolor: 'rgba(0, 0, 0, 0.6)', mx: 1 }} />
                </Box>
              </Fade>
              <EuroLogo />
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
              {menuItems.map((item) => (
                item.children ? (
                  <DropdownMenu key={item.title} item={item} sx={{
                    color: 'inherit', display: 'block', paddingY: '12px', borderRadius: '0', transition: 'background-color 0.3s ease, transform 0.3s ease',
                    '&:hover': {
                      backgroundColor: darken(theme.palette.primary.main, 0.2)
                    },
                  }} />
                ) : (
                  <Button key={item.title} href={item.href} sx={{
                    color: 'inherit', display: 'block', paddingY: '12px', borderRadius: '0', transition: 'background-color 0.3s ease, transform 0.3s ease',
                    '&:hover': {
                      backgroundColor: darken(theme.palette.primary.main, 0.2)
                    },
                  }}>
                    {item.title}
                  </Button>
                )
              ))}
              <Box px={1} sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <Typography variant="body1">
                  EURO
                </Typography>
                <Select
                  variant="outlined"
                  value={year}
                  onChange={(event) => setYear(Number(event.target.value))}
                  sx={{
                    paddingTop: '1px', color: 'white', borderColor: 'white', height: '32px',
                    '.MuiOutlinedInput-input': { paddingLeft: '4px', paddingRight: '24px !important' },
                    '.MuiSvgIcon-root': { fontSize: '1rem' },
                    '.MuiSelect-icon': { color: 'white' },
                    '&& fieldset': { border: 'none' }
                  }}
                >
                  {Array.from({ length: (2024 - 1960) / 4 + 1 }, (_, index) => 2024 - index * 4).map(year => (
                    <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar >
      <Drawer variant="temporary" open={mobileOpen} onClick={() => setMobileOpen((prevState) => !prevState)} ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' }
        }}
      >
        <Box onClick={() => setMobileOpen((prevState) => !prevState)} sx={{ textAlign: 'center' }}>
          <Box display="flex" m={2} mb={0} alignItems="center" component="a" href="/" sx={{ textDecoration: 'none' }}>
            <SvgIcon component={Logo} sx={{ width: 34, height: 34, color: 'black', mr: 2 }} />
            <Typography fontFamily="Logo" className="custom-font-element" variant="h4" noWrap sx={{ color: 'inherit', lineHeight: 'normal', mt: '12px' }}>
              Footy AI
            </Typography>
          </Box>
          <List>
            {menuItems.map((item) => (
              item.children ? (
                <>
                  <ListItem key={item.title} disablePadding>
                    <ListItemButton onClick={() => handleClick(item.title)} sx={{ padding: '16px 32px' }}>
                      <ListItemText primary={item.title} primaryTypographyProps={{ sx: { fontWeight: '900' } }} />
                      {open === item.title ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={open === item.title} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <ListItem key={child.title} disablePadding>
                          <ListItemButton href={child.href} sx={{ padding: '16px 32px 16px 50px' }}>
                            <ListItemText primary={child.title} primaryTypographyProps={{ sx: { fontWeight: '900' } }} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItem key={item.title} disablePadding>
                  <ListItemButton href={item.href} sx={{ padding: '16px 32px' }}>
                    <ListItemText primary={item.title} primaryTypographyProps={{ sx: { fontWeight: '900' } }} />
                  </ListItemButton>
                </ListItem>
              )
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
export default Header;
