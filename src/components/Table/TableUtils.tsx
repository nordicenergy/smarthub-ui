// Copyright 2018 Nordic Energy
// This file is part of the snarthub Application brought to you by the Nordic Energy,
// a global non-profit organization focused on accelerating blockchain technology across the energy sector,
// incorporated in Zug, Switzerland.
//
// The snarthub Application is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// This is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY and without an implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details, at <http://www.gnu.org/licenses/>.
//
// @authors: Nordic Energy

import { CSSProperties } from 'react';
import { ITableHeaderData } from './Table';

const getKey = lbl => {
    const trimLabel = lbl
        .replace(/ \(.*\)/g, '')
        .replace(/\<.*\>/g, '')
        .replace(/'/g, '');
    const sp = trimLabel.split(' ').map(e => (e.indexOf('(') === -1 ? e.toLowerCase() : ''));

    return sp.join('_');
};

const generateHeader = (label, width?: string | number, right = false, body = false, sortProperties: string[] = null) : ITableHeaderData => {
    const style: CSSProperties = {};

    if (right) {
        style.textAlign = 'right';
    }

    if (typeof(width) !== 'undefined') {
        if (typeof(width) === 'number') {
            style.width = `${width}px`;
        } else {
            style.width = width;
        }
    }

    return {
        label,
        key: getKey(label),
        style,
        styleBody: body ? { opacity: 1, fontWeight: 900 } : {},
        sortProperties
    };
};

const generateFooter = (label, body = false, hide = false) => {
    return {
        key: getKey(label),
        style: body ? { opacity: 1, color: 'white' } : null,
        hide
    };
};

const TableUtils = {
    getKey,
    generateHeader,
    generateFooter
};

export default TableUtils;
