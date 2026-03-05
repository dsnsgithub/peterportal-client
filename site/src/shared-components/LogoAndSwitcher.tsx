import { useIsMobile } from '../helpers/util';
import { useState } from 'react';
import type { MouseEventHandler } from 'react';

import {
  Box,
  Button,
  Link,
  ListItemIcon,
  ListSubheader,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  Typography,
  ButtonGroup,
  CircularProgress,
} from '@mui/material';
import { EventNote, Route, UnfoldMore } from '@mui/icons-material';

import { Logo } from './Logo';

// TEMP COLOR
const BLUE = '#305db7';

export function LogoAndSwitcher() {
  const isMobile = useIsMobile();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [schedulerLoading, setSchedulerLoading] = useState(false);

  const handleSchedulerClick: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement> = (event) => {
    if (schedulerLoading) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    setSchedulerLoading(true);
    setTimeout(() => {
      window.location.href = 'https://antalmanac.com/';
    }, 0);
  };

  const schedulerIcon = schedulerLoading ? (
    <CircularProgress size={20} sx={{ margin: 0 }} color="inherit" />
  ) : (
    <EventNote sx={{ fontSize: 18 }} />
  );

  const desktopButtonSx = {
    fontSize: 14,
    fontWeight: 500,
    py: 0.4,
    letterSpacing: 0,
    paddingBlock: '3.2px',
  };

  return (
    <Box>
      {isMobile ? (
        <>
          <Button
            onClick={(event) => setAnchorEl(event.currentTarget)}
            endIcon={<UnfoldMore />}
            sx={{
              paddingRight: 1,
              p: 1,
              minWidth: 'auto',
              color: 'white',
              '& .MuiTouchRipple-child': {
                borderRadius: 0.5,
                bgcolor: 'white',
              },
            }}
          >
            <Logo />
          </Button>

          <Popover
            open={!!anchorEl}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <MenuList
              subheader={
                <ListSubheader
                  component="div"
                  sx={{
                    lineHeight: '30px',
                    fontSize: '10.5px',
                    color: 'var(--mui-palette-text-secondary)',
                    bgcolor: 'inherit',
                  }}
                >
                  Switch Apps
                </ListSubheader>
              }
              sx={{ width: '200px' }}
            >
              <MenuItem
                onClick={(event) => {
                  handleSchedulerClick(event);
                  if (!event.defaultPrevented) {
                    setAnchorEl(null);
                  }
                }}
                component="a"
                href="https://antalmanac.com/"
                disabled={schedulerLoading}
                sx={{ minHeight: 'fit-content', textDecoration: 'none', color: 'inherit', height: '34.5px' }}
              >
                <ListItemIcon>{schedulerIcon}</ListItemIcon>
                <Typography
                  sx={{
                    fontSize: '15px',
                    fontWeight: 500,
                    letterSpacing: '0px',
                  }}
                >
                  Scheduler
                </Typography>
              </MenuItem>
              <MenuItem
                selected
                onClick={() => setAnchorEl(null)}
                component="a"
                href="/planner"
                sx={{ minHeight: 'fit-content', textDecoration: 'none', color: 'inherit', height: '34.5px' }}
              >
                <ListItemIcon>
                  <Route sx={{ fontSize: '18px' }} />
                </ListItemIcon>
                <Typography
                  sx={{
                    fontSize: '15px',
                    fontWeight: 500,
                    letterSpacing: '0px',
                  }}
                >
                  Planner
                </Typography>
              </MenuItem>
            </MenuList>
          </Popover>
        </>
      ) : (
        <Stack direction="row" alignItems="center" gap={2}>
          <Link href={'/planner'} component="a">
            <Logo />
          </Link>
          <ButtonGroup variant="outlined" color="inherit">
            <Button
              startIcon={schedulerIcon}
              onClick={handleSchedulerClick}
              disabled={schedulerLoading}
              sx={{
                color: 'white',
                bgcolor: BLUE,
                ...desktopButtonSx,
              }}
              variant="outlined"
              component="a"
              href="https://antalmanac.com/"
            >
              Scheduler
            </Button>
            <Button
              startIcon={<Route />}
              sx={{
                color: BLUE,
                '&:hover': { bgcolor: 'grey.100' },
                bgcolor: 'white',
                ...desktopButtonSx,
              }}
              variant="contained"
              component="a"
              href="/planner"
            >
              Planner
            </Button>
          </ButtonGroup>
        </Stack>
      )}
    </Box>
  );
}
