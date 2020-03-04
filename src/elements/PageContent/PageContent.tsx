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

import * as React from 'react';
import { Redirect } from 'react-router-dom';

import './PageContent.scss';

export class PageContent extends React.Component<any, {}> {
    render() {
        const { menu, redirectPath } = this.props;
        const PageComponent = menu.component;

        return menu ? (
            <div className="PageContentWrapper">
                <div className="PageBody">
                    {menu.component ? <PageComponent /> : 'Coming Soon...'}
                </div>
            </div>
        ) : (
            <Redirect to={{ pathname: redirectPath }} />
        );
    }
}
