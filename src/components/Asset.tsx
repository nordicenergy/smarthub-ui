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
import { Certificate } from 'nordicenergy-snarthub-lib';
import { User } from 'nordicenergy-user-registry-lib';
import { Route, NavLink, Redirect } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { ProducingAssetTable } from './ProducingAssetTable';
import { ConsumingAssetTable } from './ConsumingAssetTable';
import { PageContent } from '../elements/PageContent/PageContent';
import { ProducingAssetDetailVinordicenergy } from './ProducingAssetDetailVinordicenergy';
import { ConsumingAssetDetailVinordicenergy } from './ConsumingAssetDetailVinordicenergy';
import { Configuration } from 'nordicenergy-utils-general-lib';
import { Demand } from 'nordicenergy-market-lib';
import { ProducingAsset, ConsumingAsset } from 'nordicenergy-asset-registry-lib';

export interface AssetProps {
    conf: Configuration.Entity;
    certificates: Certificate.Entity[];
    producingAssets: ProducingAsset.Entity[];
    consumingAssets: ConsumingAsset.Entity[];
    currentUser: User;
    baseUrl: string;
    demands: Demand.Entity[];
}

export class Asset extends React.Component<AssetProps> {
    constructor(props: AssetProps) {
        super(props);

        this.ConsumingAssetTable = this.ConsumingAssetTable.bind(this);
        this.ProducingAssetTable = this.ProducingAssetTable.bind(this);
    }

    ProducingAssetTable(): JSX.Element {
        return (
            <ProducingAssetTable
                certificates={this.props.certificates}
                producingAssets={this.props.producingAssets}
                conf={this.props.conf}
                currentUser={this.props.currentUser}
                baseUrl={this.props.baseUrl}
            />
        );
    }

    ConsumingAssetTable(): JSX.Element {
        return (
            <ConsumingAssetTable
                certificates={this.props.certificates}
                demands={this.props.demands}
                consumingAssets={this.props.consumingAssets}
                conf={this.props.conf}
                currentUser={this.props.currentUser}
                baseUrl={this.props.baseUrl}
            />
        );
    }

    ProductionDetailVinordicenergy(id: number): JSX.Element {
        return (
            <ProducingAssetDetailVinordicenergy
                id={id}
                baseUrl={this.props.baseUrl}
                producingAssets={this.props.producingAssets}
                conf={this.props.conf}
                certificates={this.props.certificates}
                addSearchField={true}
                showCertificates={true}
                showSmartMeterReadings={true}
            />
        );
    }

    ConsumingDetailVinordicenergy(id: number): JSX.Element {
        return (
            <ConsumingAssetDetailVinordicenergy
                id={id}
                baseUrl={this.props.baseUrl}
                consumingAssets={this.props.consumingAssets}
                conf={this.props.conf}
                certificates={this.props.certificates}
            />
        );
    }

    render(): JSX.Element {
        const AssetsMenu = [
            {
                key: 'production',
                label: 'Production List',
                component: this.ProducingAssetTable
            },
            {
                key: 'consumption',
                label: 'Consumption List',
                component: this.ConsumingAssetTable
            },
            {
                key: 'producing_detail_vinordicenergy',
                label: 'Production Detail',
                component: null
            },
            {
                key: 'consuming_detail_vinordicenergy',
                label: 'Consumption Detail',
                component: null
            }
        ];

        return (
            <div className="PageWrapper">
                <div className="PageNav">
                    <Nav className="NavMenu">
                        {AssetsMenu.map(menu => {
                            return (
                                <li key={menu.key}>
                                    <NavLink
                                        to={`/${this.props.baseUrl}/assets/${menu.key}`}
                                        activeClassName="active"
                                    >
                                        {menu.label}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </Nav>
                </div>

                <Route
                    path={'/' + this.props.baseUrl + '/assets/:key/:id?'}
                    render={props => {
                        const key = props.match.params.key;
                        const id = props.match.params.id;
                        const matches = AssetsMenu.filter(item => {
                            return item.key === key;
                        });
                        if (matches.length > 0 && key === 'producing_detail_vinordicenergy') {
                            matches[0].component = () =>
                                this.ProductionDetailVinordicenergy(id ? parseInt(id, 10) : id);
                        } else if (matches.length > 0 && key === 'consuming_detail_vinordicenergy') {
                            matches[0].component = () =>
                                this.ConsumingDetailVinordicenergy(id ? parseInt(id, 10) : id);
                        }

                        return (
                            <PageContent
                                menu={matches.length > 0 ? matches[0] : null}
                                redirectPath={'/' + this.props.baseUrl + '/assets'}
                            />
                        );
                    }}
                />
                <Route
                    exact={true}
                    path={'/' + this.props.baseUrl + '/assets'}
                    render={props => (
                        <Redirect
                            to={{ pathname: `/${this.props.baseUrl}/assets/${AssetsMenu[0].key}` }}
                        />
                    )}
                />
                <Route
                    exact={true}
                    path={'/' + this.props.baseUrl + '/'}
                    render={props => (
                        <Redirect
                            to={{ pathname: `/${this.props.baseUrl}/assets/${AssetsMenu[0].key}` }}
                        />
                    )}
                />
            </div>
        );
    }
}
