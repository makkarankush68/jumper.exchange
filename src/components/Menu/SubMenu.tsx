'use client';
import type { MenuKeysEnum } from '@/const/menuKeys';
import { useMenuStore } from '@/stores/menu';
import type { MenuListItem } from '@/types/internal';
import { getContrastAlphaColor } from '@/utils/colors';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { Breakpoint } from '@mui/material';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import type { KeyboardEvent } from 'react';
import { useEffect, useRef } from 'react';
import {
  MenuHeaderAppBar,
  MenuHeaderAppWrapper,
  MenuHeaderLabel,
  MenuItemContainer,
  MenuItemLink,
  MenuLabel,
  MenuPaper,
} from '.';

interface SubMenuProps {
  open: boolean;
  label: string;
  prevMenu: MenuKeysEnum;
  subMenuList: MenuListItem[];
  triggerSubMenu: MenuKeysEnum;
}

export const SubMenu = ({
  open,
  prevMenu,
  label,
  triggerSubMenu,
  subMenuList,
}: SubMenuProps) => {
  const theme = useTheme();
  const menuListRef = useRef(null);
  const { openSubMenu, setSubMenuState } = useMenuStore((state) => state);

  function handleBackSpace(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Backspace') {
      setSubMenuState(prevMenu);
    }
  }

  const handleClick = (el: MenuListItem) => {
    el.onClick();
  };

  const handleBackNavigation = () => {
    setSubMenuState(prevMenu);
  };

  useEffect(() => {
    if (menuListRef.current && open && openSubMenu === triggerSubMenu) {
      const menuList: HTMLUListElement = menuListRef.current;
      menuList.scrollTop = 0;
    }
  }, [open, openSubMenu, triggerSubMenu]);

  return (
    <MenuPaper
      show={openSubMenu === triggerSubMenu}
      className="submenu"
      onKeyDown={handleBackSpace}
      autoFocus={open}
      component={'ul'}
      ref={menuListRef}
    >
      <MenuHeaderAppWrapper>
        <MenuHeaderAppBar component="div" elevation={0}>
          <IconButton
            size="medium"
            aria-label="settings"
            edge="start"
            sx={{
              marginLeft: 0,
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: getContrastAlphaColor(theme, '4%'),
              },
            }}
            onClick={(event) => {
              event.stopPropagation();
              handleBackNavigation();
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <MenuHeaderLabel>{label}</MenuHeaderLabel>
        </MenuHeaderAppBar>
      </MenuHeaderAppWrapper>
      {!!subMenuList.length ? (
        subMenuList.map((el, index) =>
          !!el.link?.url ? (
            <MenuItemContainer
              autoFocus={index > 0 ? true : false}
              onClick={() => handleClick(el)}
              key={`${el.label}-${index}`}
            >
              <MenuItemLink
                autoFocus={index > 0 ? true : false}
                href={el.link.url}
                target={el.link.external ? '_blank' : '_self'}
                onClick={(event) => {
                  event.stopPropagation();
                  el.onClick();
                }}
                component="li"
                key={`${el.label}-${index}`}
              >
                <MenuLabel
                  variant={
                    !el.suffixIcon && !el.checkIcon && !el.showMoreIcon
                      ? 'lg'
                      : (el.showMoreIcon || el.checkIcon) && el.suffixIcon
                        ? 'xs'
                        : 'md'
                  }
                >
                  {el.prefixIcon}
                  <Typography
                    sx={{
                      maxWidth: 'inherit',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    variant={'lifiBodyMedium'}
                    ml={!!el.prefixIcon ? theme.spacing(1.5) : 'inherit'}
                    mr={!!el.suffixIcon ? theme.spacing(1.5) : 'inherit'}
                  >
                    {`${el.label || ' '}`}
                  </Typography>
                  {el.suffixIcon}
                </MenuLabel>
              </MenuItemLink>
            </MenuItemContainer>
          ) : (
            <MenuItemContainer
              autoFocus={index > 0 ? true : false}
              onClick={() => handleClick(el)}
              key={`${el.label}-${index}`}
            >
              <MenuLabel
                variant={
                  !el.suffixIcon && !el.checkIcon && !el.showMoreIcon
                    ? 'lg'
                    : (el.showMoreIcon || el.checkIcon) && el.suffixIcon
                      ? 'xs'
                      : 'md'
                }
              >
                {el.prefixIcon}
                <Typography
                  variant={'lifiBodyMedium'}
                  ml={!!el.prefixIcon ? theme.spacing(1.5) : 'inherit'}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 'inherit',
                    [theme.breakpoints.up('sm' as Breakpoint)]: {
                      maxWidth: el.prefixIcon ? 188 : 'inherit',
                    },
                  }}
                >
                  {`${el.label || ' '}`}
                </Typography>
              </MenuLabel>
              {el.checkIcon && <CheckIcon />}
              {el.showMoreIcon ? (
                <ChevronRightIcon sx={{ ml: theme.spacing(1) }} />
              ) : null}
            </MenuItemContainer>
          ),
        )
      ) : (
        <Box textAlign={'center'} mt={theme.spacing(1)}>
          <CircularProgress />
        </Box>
      )}
    </MenuPaper>
  );
};
