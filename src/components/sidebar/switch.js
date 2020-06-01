import React from 'react';
import './switch.css';

const Switch = ({ isOn, handleModeToggle }) => {
    return (
        <>
            <div>
                <input
                    checked={isOn}
                    onChange={handleModeToggle}
                    className="react-switch-checkbox"
                    id={'react-switch-new'}
                    type="checkbox"
                />
                <label
                    style={{ background: isOn && '#06D6A0' }}
                    className="react-switch-label"
                    htmlFor={'react-switch-new'}
                >
                    <span className={'react-switch-button'} />    
                </label>
            </div>
        </>
    );
};

export default Switch;