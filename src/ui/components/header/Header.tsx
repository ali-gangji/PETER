import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import EmailIcon from '@mui/icons-material/Email';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Menu, { MenuProps } from '@mui/material/Menu';
import { styled, alpha } from '@mui/material/styles';

function BrandLogo() {
  // The SVG logo has been replaced with this styled placeholder div.
  return (
    <div className="h-8 w-40 bg-slate-200 rounded flex items-center justify-center">
      <span className="text-xs font-semibold text-slate-500">Logo Placeholder</span>
    </div>
  );
}

interface MenuLinkProps {
  path: string;
  label: string;
  value: number;
  setState: any;
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

function MenuLink({ setState, path, label, value }: MenuLinkProps) {
  const navigate = useNavigate();
  const handleClick = (toPath: string) => navigate(toPath);

  return (
    <Tab
      label={label}
      onClick={() => {
        setState(value);
        handleClick(path);
      }}
    />
  );
}

function getLastPart(url: string) {
  const parts = url.split('/');
  return parts.at(-1);
}

function Header() {
  const links = [
    { path: '/', label: 'About', value: 0 },
    { path: '/evaluation', label: 'Evaluation', value: 1 },
  ];

  const currentUrl = window.location.href;
  const index = links.findIndex(
    (object) => object.path === `/${getLastPart(currentUrl)}`
  );

  const [activeTab, setActiveTab] = React.useState(index);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      {/* Top Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Toolbar disableGutters sx={{ minHeight: '80px' }}>
          <BrandLogo />
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <Button
              variant="outlined"
              onClick={handleClick}
              disableElevation
              sx={{
                color: '#E6002D',
                borderColor: '#E6002D',
                '&:hover': {
                  borderColor: '#E6002D',
                  backgroundColor: 'rgba(230, 0, 45, 0.04)',
                },
              }}
            >
              Useful links
            </Button>
            <StyledMenu
              id="demo-customized-menu"
              MenuListProps={{
                'aria-labelledby': 'demo-customized-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem component="a" href="">
                <ListItemIcon>
                  <EnergySavingsLeafIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Ecodesign space</ListItemText>
              </MenuItem>
              <MenuItem component="a" href="">
                <ListItemIcon>
                  <HelpIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Questions</ListItemText>
              </MenuItem>
              <MenuItem component="a" href="">
                <ListItemIcon>
                  <EmailIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Contact</ListItemText>
              </MenuItem>
            </StyledMenu>
          </Box>
        </Toolbar>
      </div>
      {/* Bottom Row */}
      <div style={{ backgroundColor: '#f4f4f4' }} className="border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Toolbar disableGutters sx={{ minHeight: '56px' }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 400,
                fontSize: '1.4rem',
                lineHeight: 1,
                color: 'text.primary'
              }}
            >
              PETER
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Tabs
              value={activeTab}
              TabIndicatorProps={{
                style: {
                  backgroundColor: '#E6002D',
                },
              }}
              sx={{
                '& .Mui-selected': {
                  color: '#E6002D !important',
                },
                '& .MuiTab-root': {
                  color: '#334155',
                  fontWeight: 500,
                },
              }}
            >
              {links.map((link) => (
                <MenuLink
                  setState={setActiveTab}
                  key={link.path}
                  path={link.path}
                  label={link.label}
                  value={link.value}
                />
              ))}
            </Tabs>
          </Toolbar>
        </div>
      </div>
    </header>
  );
}

export default Header;