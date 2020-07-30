import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { PopoverProps as SlashPopoverProps } from '@slash/editor';
import MuiPopover from '@material-ui/core/Popover';

export type PopoverProps = SlashPopoverProps;

const useStyles = makeStyles(() =>
  createStyles({
    root: {},
    paper: {
      minWidth: 200,
      borderRadius: 3,
      boxShadow:
        'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px',
    },
  }),
);

const Popover: React.FC<PopoverProps> = ({ children, ...other }) => {
  const classes = useStyles();

  return (
    <MuiPopover
      anchorReference="anchorEl"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      classes={classes}
      {...other}
    >
      {children}
    </MuiPopover>
  );
};

export default Popover;