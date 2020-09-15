import React, { useRef, useEffect, useLayoutEffect } from 'react';
import logo from '../../Media/logo.svg';
import { useAbuse } from 'use-abuse'
import { useInView } from 'react-intersection-observer'
import { VscChromeMinimize, VscChromeMaximize, VscChromeRestore, VscChromeClose } from 'react-icons/vsc';
import { BsThreeDots } from 'react-icons/bs'
// import constants from './constants'
import './Nav.less'
const electron = window.require("electron")

const MenuItem = ({ onVis, label, ...props }) => {
  const [ref, inView, entry] = useInView({
    /* Optional options */
    threshold: 1,
  })
  useEffect(() => {
    onVis && onVis(inView, entry)
  }, [inView])

  return (
    <div {...props} ref={ref}>
      <div >{label}</div>
    </div>
  )
}

const initMenus = [
  { label: 'File'},
  { label: 'Edit'},
  { label: 'Image'},
  { label: 'Layer'},
  { label: 'Select'},
  { label: 'Filter'},
  { label: 'View'},
  { label: 'Window'},
  { label: 'Help'},
]
const Nav=() =>{
  const [state, setState] = useAbuse({
    fullscreen: false,
    menus: initMenus
  })
  const hiddenElements = state.menus.filter(item => !item.visible).length
  const setMenuItemVisible = React.useCallback((label, visible, entry) => {
    setState(prev => ({
      menus: prev.menus.map(item => item.label === label ? { ...item, visible, entry } : item)
    })
    )
  }, [])
  const lastEntry = state.menus[state.menus.length - hiddenElements - 1]
  useEffect(() => {
    electron.ipcRenderer.on('fullscreen-true', (event, arg) => {
      setState({fullscreen:true})
    });
    electron.ipcRenderer.on('fullscreen-false', (event, arg) => {
      setState({fullscreen:false})
    });
  }, []);
  return (
    <nav className={'app-nav'}>
      <div className={`nav-container`}>
        <img src={logo} alt={`logo`} className={`nav-logo`}></img>
        <ul className={`nav-actions nav-overflow-container`}>
          {state.menus.map(item => (
            <li key={item.label} className={`${item.visible ? '' : 'hide'} nav-button setting`}>
              <MenuItem label={item.label} onVis={(visible, entry) => setMenuItemVisible(item.label, visible, entry)} />
            </li>
          ))}
          {hiddenElements > 0 && lastEntry &&
            <div className={`overflow-indicator`} style={{ left: lastEntry.entry.target.offsetLeft + lastEntry.entry.target.offsetWidth }}>
              <BsThreeDots className={`three-dots nav-button `} />
            </div>
          }
        </ul>

        <ul className={`nav-actions sys-buttons-group`}>
          <li className={`nav-button`}
            onClick={() => {
              var window = electron.remote.getCurrentWindow();
              window.minimize();
            }}
          >
            <VscChromeMinimize /></li>
          {(state.fullscreen &&
            <li className={`nav-button`}
              onClick={() => {
                var window = electron.remote.getCurrentWindow();
                window.unmaximize()
              }}
            ><VscChromeRestore /></li>
          ) ||
            <li className={`nav-button`}
              onClick={() => {
                var window = electron.remote.getCurrentWindow();
                window.maximize()
              }}
            ><VscChromeMaximize /></li>
          }
          <li className={`nav-button exit`}
            onClick={() => {
              var window = electron.remote.getCurrentWindow();
              window.close();
            }}
          ><VscChromeClose /></li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
