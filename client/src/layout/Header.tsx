import { AppBar, Box, Container, Toolbar, IconButton, Typography, Button, Drawer, List, ListItem, ListItemButton, ListItemText, Divider, Select, MenuItem, SvgIcon, Fade, useMediaQuery, Menu, Collapse, SxProps, Theme } from '@mui/material';
import { ExpandLess, ExpandMore, Menu as MenuIcon } from '@mui/icons-material';
import { useEffect, useState, useRef, Fragment } from 'react';
import { useStats } from '@/utils/StatsContext';
import { useLanguage } from '@/utils/LanguageProvider';
import { useIntl } from 'react-intl';
import { useTheme, lighten, darken } from '@mui/material/styles';
import Logo from './Logo';
import EuroLogo from './EuroLogo';

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
    { title: formatMessage({ id: 'header.about' }), href: "/about", },
  ];

  const languages = { en: 'English', fr: 'Français', de: 'Deutsch', es: 'Español', it: 'Italiano', pt: 'Português' };

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
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)}
        >
          <Box display="flex" alignItems="center" gap="8px">
            {item.title}
            {Boolean(anchorEl) ? <ExpandLess /> : <ExpandMore />}
          </Box>
        </Button>
        <Menu id="menu-list-grow" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
          sx={{ '& .MuiPaper-root': { borderRadius: '0 !important', '& .MuiMenu-list': { padding: '0px !important' }, }, }}
        >
          {item.children?.map((child) => (
            <MenuItem sx={{ padding: '0px' }} key={child.title} onClick={() => setAnchorEl(null)}>
              <Button href={child.href} sx={sx} fullWidth>
                {child.title}
              </Button>
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  };

  const getColour = () => {
    return year === 1972 ? '#000000' : '#FFFFFF';
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
      <Box id="box-id" py={2} color="white" sx={{ bgcolor: lighten(theme.palette.primary.main, 0.12), display: { xs: 'none', md: 'flex' } }}>
        <Container sx={{ maxWidth: "1200px" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Box display="flex" alignItems="center" component="a" href="/" color={getColour()} sx={{ textDecoration: 'none' }}>
              <SvgIcon component={Logo} sx={{ width: 68, height: 68, color: 'black', mr: 2 }} />
              <Typography fontFamily="Logo" variant="h2" noWrap sx={{ color: 'inherit', lineHeight: 'normal', mt: '14px', }}>
                Footy AI
              </Typography>
            </Box>
            <Select variant="outlined" value={language} onChange={(event) => setLanguage(event.target.value as string)} label="Language"
              sx={{ color: getColour(), borderColor: 'white', height: '32px', '.MuiSvgIcon-root': { fontSize: '1rem' }, '.MuiSelect-icon': { color: getColour() }, '.MuiOutlinedInput-input': { paddingLeft: '4px', paddingRight: '24px !important' }, '&& fieldset': { border: 'none' }, }}
            >
              {Object.entries(languages).map(([code, name]) => (
                <MenuItem key={code} value={code}>{name}</MenuItem>
              ))}
            </Select>
          </Toolbar>
        </Container>
      </Box>
      <AppBar component="nav" position="sticky" elevation={isStuck ? 4 : 0}>
        <Container sx={{ maxWidth: "1200px" }}>
          <Toolbar variant='dense' ref={containerRef}>
            <IconButton aria-label="open drawer" edge="start" onClick={() => setMobileOpen((prevState) => !prevState)} sx={{ mr: 2, display: { md: 'none' }, color: getColour() }}>
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
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {menuItems.map((item) => (
                item.children ? (
                  <DropdownMenu key={item.title} item={item} sx={{
                    color: getColour(), backgroundColor: 'primary.main', display: 'block', paddingY: '12px', borderRadius: '0', transition: 'background-color 0.3s ease, transform 0.3s ease',
                    '&:hover': {
                      backgroundColor: darken(theme.palette.primary.main, 0.2)
                    },
                  }} />
                ) : (
                  <Button key={item.title} href={item.href} sx={{
                    color: getColour(), display: 'block', paddingY: '12px', borderRadius: '0', transition: 'background-color 0.3s ease, transform 0.3s ease',
                    '&:hover': {
                      backgroundColor: darken(theme.palette.primary.main, 0.2)
                    },
                  }}>
                    {item.title}
                  </Button>
                )
              ))}
              <Box px={1} sx={{ display: 'flex', alignItems: 'center', color: getColour() }}>
                <Select variant="outlined" value={year} onChange={(event) => setYear(Number(event.target.value))} renderValue={(selectedValue) => `EURO ${selectedValue}`} label="Tournament Year"
                  sx={{
                    paddingTop: '1px', color: getColour(), borderColor: 'white', height: '32px', fontWeight: '500', fontSize: '14px',
                    '.MuiOutlinedInput-input': { paddingLeft: '4px', paddingRight: '24px !important' },
                    '.MuiSvgIcon-root': { fontSize: '1rem' }, '.MuiSelect-icon': { color: getColour() }, '&& fieldset': { border: 'none' }
                  }}
                  MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
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
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { minWidth: '300px' } }}
      >
        <Box onClick={() => setMobileOpen((prevState) => !prevState)} sx={{ textAlign: 'center' }}>
          <Box display="flex" m={2} mb={0} alignItems="center" component="a" href="/" sx={{ textDecoration: 'none' }}>
            <SvgIcon component={Logo} sx={{ width: 34, height: 34, color: 'black', mr: 2 }} />
            <Typography fontFamily="Logo" className="custom-font-element" variant="h4" noWrap sx={{ color: 'primary.main', lineHeight: 'normal', mt: '12px' }}>
              Footy AI
            </Typography>
          </Box>
          <List style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {menuItems.map((item) => (
              item.children ? (
                <Fragment key={item.title}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleClick(item.title)} sx={{ padding: '16px 32px' }}>
                      <ListItemText primary={item.title} primaryTypographyProps={{ sx: { fontWeight: '900' } }} />
                      {open === item.title ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={open === item.title} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <ListItem key={child.title} disablePadding> {/* Key is correctly added here */}
                          <ListItemButton href={child.href} sx={{ padding: '16px 32px 16px 50px' }}>
                            <ListItemText primary={child.title} primaryTypographyProps={{ sx: { fontWeight: '900' } }} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </Fragment>
              ) : (
                <ListItem key={item.title} disablePadding>
                  <ListItemButton href={item.href} sx={{ padding: '16px 32px' }}>
                    <ListItemText primary={item.title} primaryTypographyProps={{ sx: { fontWeight: '900' } }} />
                  </ListItemButton>
                </ListItem>
              )
            ))}
            <ListItem disablePadding>
              <ListItemButton sx={{ padding: '16px 32px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Select variant="outlined" value={year} onChange={(event) => setYear(Number(event.target.value))} renderValue={(selectedValue) => `EURO ${selectedValue}`} label="Tournament Year"
                    sx={{
                      paddingTop: '1px', fontWeight: '900', borderColor: 'white', height: '32px',
                      '.MuiOutlinedInput-input': { paddingLeft: '4px', paddingRight: '24px !important' },
                      '.MuiSvgIcon-root': { fontSize: '1rem' }, '&& fieldset': { border: 'none' }
                    }}
                    MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
                  >
                    {Array.from({ length: (2024 - 1960) / 4 + 1 }, (_, index) => 2024 - index * 4).map(year => (
                      <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
                    ))}
                  </Select>
                </Box>
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton sx={{ padding: '0px', width: '100%', '&:hover': { bgcolor: 'transparent' } }}>
                <Select variant="outlined" value={language} onChange={(event) => setLanguage(event.target.value as string)} fullWidth label="Language"
                  sx={{
                    color: 'inherit', fontWeight: '900', '.MuiSvgIcon-root': { fontSize: '1rem' }, '.MuiOutlinedInput-input': { paddingLeft: '0px', textAlign: 'center' },
                    '&& fieldset': { border: 'none' }, '& .MuiSelect-select': { padding: '16px 32px' },
                  }}
                >
                  {Object.entries(languages).map(([code, name]) => (
                    <MenuItem key={code} value={code}>{name}</MenuItem>
                  ))}
                </Select>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
export default Header;
