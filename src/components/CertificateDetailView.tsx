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
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Certificate } from 'nordicenergy-snarthub-lib';
import { ProducingAsset } from 'nordicenergy-asset-registry-lib';
import { User } from 'nordicenergy-user-registry-lib';
import { ProducingAssetDetailVinordicenergy } from './ProducingAssetDetailVinordicenergy';

import './DetailVinordicenergy.scss';
import { Configuration } from 'nordicenergy-utils-general-lib';

export interface DetailVinordicenergyProps {
    conf: Configuration.Entity;
    id: number;
    baseUrl: string;
    certificates: Certificate.Entity[];
    producingAssets: ProducingAsset.Entity[];
}

export interface DetailVinordicenergyState {
    nordicenergyId: number;
    owner: User;
    events: EnrichedEvent[];
}

export interface EnrichedEvent {
    txHash: string;
    label: string;
    description: string;
    timestamp: number;
}

const TableWidth = [210, 210, 210, 210, 407];

export class CertificateDetailVinordicenergy extends React.Component<DetailVinordicenergyProps, DetailVinordicenergyState> {
    constructor(props: DetailVinordicenergyProps) {
        super(props);
        this.state = {
            nordicenergyId: null,
            owner: null,
            events: []
        };
        this.onInputChange = this.onInputChange.bind(this);
    }

    onInputChange(e) {
        this.setState({ nordicenergyId: e.target.value });
    }

    componentDidMount() {
        this.init(this.props);
    }

    componentWillReceiveProps(nordicenergyProps: DetailVinordicenergyProps) {
        this.init(nordicenergyProps);
    }

    init(props: DetailVinordicenergyProps) {
        if (props.id !== null && props.id !== undefined) {
            const selectedCertificate: Certificate.Entity = props.certificates.find(
                (c: Certificate.Entity) => c.id === props.id.toString()
            );
            if (selectedCertificate) {
                this.getOwner(props, selectedCertificate, () =>
                    this.enrichEvent(props, selectedCertificate)
                );
            }
        }
    }

    async getOwner(props: DetailVinordicenergyProps, selectedCertificate: Certificate.Entity, cb) {
        this.setState(
            {
                owner: await nordicenergy User(selectedCertificate.owner, props.conf as any).sync()
            },
            cb
        );
    }

    async enrichEvent(props: DetailVinordicenergyProps, selectedCertificate: Certificate.Entity) {
        const asset = this.props.producingAssets.find(
            (p: ProducingAsset.Entity) => p.id === selectedCertificate.assetId.toString()
        );

        const jointEvents = (await selectedCertificate.getAllCertificateEvents()).map(
            async (event: any) => {
                let label;
                let description;

                switch (event.event) {
                    case 'LognordicenergyMeterRead':
                        label = 'Initial Logging';
                        description = 'Logging by Asset #' + event.returnValues._assetId;
                        break;
                    case 'LogCreatedCertificate':
                        const organization = (await nordicenergy User(
                            event.returnValues.owner,
                            props.conf as any
                        ).sync()).organization;
                        label = 'Certificate Created';
                        description = 'Certificate created by asset ' + selectedCertificate.assetId;
                        break;
                    case 'LogRetireRequest':
                        label = 'Certificate Claimed';
                        description = 'Initiated by ' + this.state.owner.organization;
                        break;
                    case 'Transfer':
                        if (
                            (event as any).returnValues._from ===
                            '0x0000000000000000000000000000000000000000'
                        ) {
                            label = 'Set Initial Owner';
                            description = (await nordicenergy User(
                                (event as any).returnValues._to,
                                props.conf as any
                            ).sync()).organization;
                        } else {
                            const nordicenergyOwner = (await nordicenergy User(
                                (event as any).returnValues._to,
                                props.conf as any
                            ).sync()).organization;
                            const oldOwner = (await nordicenergy User(
                                (event as any).returnValues._from,
                                props.conf as any
                            ).sync()).organization;
                            label = 'Certificate Owner Change';
                            description = 'Ownership changed from ' + oldOwner + ' to ' + nordicenergyOwner;
                        }
                        break;
                    case 'LogPublishForSale':
                        label = 'Certificate published for sale';
                        break;
                    case 'LogUnpublishForSale':
                        label = 'Certificate unpublished from sale';
                        break;

                    default:
                        label = event.event;
                }

                return {
                    txHash: event.transactionHash,
                    label,
                    description,
                    timestamp: (await props.conf.blockchainProperties.web3.eth.getBlock(
                        event.blockNumber
                    )).timestamp
                };
            }
        );

        Promise.all(jointEvents).then(events => {
            this.setState({
                events: events as any
            });
        });
    }

    render() {
        const selectedCertificate =
            this.props.id !== null && this.props.id !== undefined
                ? this.props.certificates.find(
                      (c: Certificate.Entity) => c.id === this.props.id.toString()
                  )
                : null;

        let data;
        let events = [];
        if (selectedCertificate) {
            events = this.state.events.reverse().map((event: EnrichedEvent) => (
                <p key={event.txHash}>
                    <span className="timestamp text-muted">
                        {nordicenergy Date(event.timestamp * 1000).toLocaleString()} -{' '}
                        <a
                            href={'https://tobalaba.etherscan.com/tx/' + event.txHash}
                            className="text-muted"
                            target="_blank"
                        >
                            {event.txHash}
                        </a>
                    </span>
                    <br />
                    {event.label} - {event.description}
                    <br />
                </p>
            ));

            const asset = this.props.producingAssets.find(
                (p: ProducingAsset.Entity) => p.id === selectedCertificate.assetId.toString()
            );

            data = [
                [
                    {
                        label: 'Certificate Id',
                        data: selectedCertificate.id
                    },
                    {
                        label: 'Current Owner',
                        data: this.state.owner ? this.state.owner.organization : ''
                    },
                    {
                        label: 'Claimed',
                        data:
                            selectedCertificate.status === Certificate.Status.Retired ? 'yes' : 'no'
                    },
                    {
                        label: 'Producing Asset Id',
                        data: asset.id,
                        link: `/${this.props.baseUrl}/assets/producing_detail_vinordicenergy/${asset.id}`
                    },

                    {
                        label: 'Certified Energy (kWh)',
                        data: (selectedCertificate.powerInW / 1000).toLocaleString()
                    },
                    {
                        label: 'Creation Date',
                        data: moment(selectedCertificate.creationTime * 1000).format('DD MMM YY')
                    }
                ]
            ];
        }

        return (
            <div className="DetailVinordicenergyWrapper">
                <div className="FindAsset">
                    <input
                        onChange={this.onInputChange}
                        defaultValue={
                            this.props.id || this.props.id === 0 ? this.props.id.toString() : ''
                        }
                    />

                    <Link
                        className="btn btn-primary find-asset-button"
                        to={`/${this.props.baseUrl}/certificates/detail_vinordicenergy/${this.state.nordicenergyId}`}
                    >
                        Find Certificate
                    </Link>
                </div>
                <div className="PageContentWrapper">
                    <div className="PageBody">
                        {!selectedCertificate ? (
                            <div className="text-center">
                                <strong>Certificate not found</strong>
                            </div>
                        ) : (
                            <div>
                                <table>
                                    <tbody>
                                        {data.map((row: any) => (
                                            <tr key={row.label}>
                                                {row.map(col => (
                                                    <td
                                                        key={col.label}
                                                        rowSpan={col.rowspan || 1}
                                                        colSpan={col.colspan || 1}
                                                    >
                                                        <div className="Label">{col.label}</div>
                                                        <div className="Data">
                                                            {col.data}{' '}
                                                            {col.tip && <span>{col.tip}</span>}
                                                        </div>

                                                        {col.description && (
                                                            <div className="Description">
                                                                {col.description}
                                                            </div>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    {selectedCertificate ? (
                        <ProducingAssetDetailVinordicenergy
                            id={selectedCertificate.assetId}
                            baseUrl={this.props.baseUrl}
                            producingAssets={this.props.producingAssets}
                            conf={this.props.conf}
                            certificates={this.props.certificates}
                            addSearchField={false}
                            showSmartMeterReadings={false}
                            showCertificates={false}
                        />
                    ) : null}
                    {selectedCertificate ? (
                        <div className="PageBody">
                            <div className="history">
                                <div>{events}</div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}

const addCommas = intNum => {
    return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
};
