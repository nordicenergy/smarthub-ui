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
import { Nav } from 'react-bootstrap';

import { ProducingAsset, ConsumingAsset } from 'nordicenergy-asset-registry-lib';
import { User } from 'nordicenergy-user-registry-lib';
import { Demand } from 'nordicenergy-market-lib';
import { Configuration } from 'nordicenergy-utils-general-lib';

import { PageContent } from '../elements/PageContent/PageContent';
import { DemandTable } from './DemandTable';

export interface IDemandsProps {
    conf: Configuration.Entity;
    demands: Demand.Entity[];
    producingAssets: ProducingAsset.Entity[];
    consumingAssets: ConsumingAsset.Entity[];
    currentUser: User;
    baseUrl: string;
}

export class Demands extends React.Component<IDemandsProps> {
    constructor(props) {
        super(props);

        this.DemandTable = this.DemandTable.bind(this);
    }

    DemandTable() {
        return (
            <DemandTable
                conf={this.props.conf}
                producingAssets={this.props.producingAssets}
                currentUser={this.props.currentUser}
                demands={this.props.demands}
                consumingAssets={this.props.consumingAssets}
                baseUrl={this.props.baseUrl}
            />
        );
    }

    render() {
        const DemandsMenu = {
            key: 'demands',
            label: 'Demands',
            component: this.DemandTable
        };

        return (
            <div className="PageWrapper">
                <div className="PageNav">
                    <Nav className="NavMenu" />
                </div>

                <PageContent
                    menu={DemandsMenu}
                    redirectPath={'/' + this.props.baseUrl + '/demands'}
                />
            </div>
        );
    }
}
