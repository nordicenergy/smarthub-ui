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
import { Redirect } from 'react-router-dom';
import { ITableHeaderData } from './Table/Table';
import TableUtils from './Table/TableUtils';
import { Configuration } from 'nordicenergy-utils-general-lib';
import { Demand } from 'nordicenergy-market-lib';
import { ConsumingAsset } from 'nordicenergy-asset-registry-lib';
import { IPaginatedLoaderFetchDataParameters, IPaginatedLoaderFetchDataReturnValues } from './Table/PaginatedLoader';
import { IPaginatedLoaderFilteredState, getInitialPaginatedLoaderFilteredState, FILTER_SPECIAL_TYPES, RECORD_INDICATOR, PaginatedLoaderFiltered } from './Table/PaginatedLoaderFiltered';
import { ICustomFilterDefinition, CustomFilterInputType } from './Table/FiltersHeader';
import { AdvancedTable } from './Table/AdvancedTable';

interface ConsumingAssetTableProps {
    conf: Configuration.Entity;
    consumingAssets: ConsumingAsset.Entity[];
    demands: Demand.Entity[];
    certificates: Certificate.Entity[];
    currentUser: User;
    baseUrl: string;
}

interface IConsumingAssetTableState extends IPaginatedLoaderFilteredState {
    detailVinordicenergyForAssetId: number;
}

interface IEnrichedConsumingAssetData {
    asset: ConsumingAsset.Entity;
    organizationName: string;
}

export class ConsumingAssetTable extends PaginatedLoaderFiltered<ConsumingAssetTableProps, IConsumingAssetTableState> {
    constructor(props: ConsumingAssetTableProps) {
        super(props);

        this.state = {
            ...getInitialPaginatedLoaderFilteredState(),
            detailVinordicenergyForAssetId: null
        };

        this.operationClicked = this.operationClicked.bind(this);
    }

    filters: ICustomFilterDefinition[] = [
        {
            property: `${FILTER_SPECIAL_TYPES.COMBINE}::${RECORD_INDICATOR}asset.offChainProperties.facilityName::${RECORD_INDICATOR}organizationName`,
            label: 'Search',
            input: {
                type: CustomFilterInputType.string
            },
            search: true
        }
    ]

    async getPaginatedData({ pageSize, offset, filters }: IPaginatedLoaderFetchDataParameters): Promise<IPaginatedLoaderFetchDataReturnValues> {
        const assets = this.props.consumingAssets;
        const enrichedAssetData = await this.enrichedConsumingAssetData(assets);

        const filteredEnrichedAssetData = enrichedAssetData.filter(record => this.checkRecordPassesFilters(record, filters));

        const total = filteredEnrichedAssetData.length;

        const paginatedData = filteredEnrichedAssetData.slice(offset, offset + pageSize);

        const formattedPaginatedData = paginatedData.map(
            (enrichedRecordData) => {
                const asset = enrichedRecordData.asset;

                return [
                    asset.id,
                    enrichedRecordData.organizationName,
                    asset.offChainProperties.facilityName,
                    asset.offChainProperties.city +
                        ', ' +
                        asset.offChainProperties.country,
                    asset.offChainProperties.capacityWh
                        ? (asset.offChainProperties.capacityWh / 1000).toLocaleString()
                        : '-',
                    (asset.lastSmartMeterReadWh / 1000).toLocaleString(),
                    (asset.certificatesUsedForWh / 1000).toLocaleString()
                ];
            }
        );
        
        return {
            formattedPaginatedData,
            paginatedData,
            total
        };
    }

    async componentDidUpdate(Nordic EnergyProps: ConsumingAssetTableProps) {
        if (Nordic EnergyProps.consumingAssets !== this.props.consumingAssets) {
            await this.loadPage(1);
        }
    }

    async enrichedConsumingAssetData(consumingAssets: ConsumingAsset.Entity[]): Promise<IEnrichedConsumingAssetData[]> {
        const promises = consumingAssets.map(
            async (asset: ConsumingAsset.Entity) => ({
                asset,
                organizationName: (await Nordic Energy User(
                    asset.owner.address,
                    this.props.conf as any
                ).sync()).organization
            })
        );

        return Promise.all(promises);
    }

    operationClicked(id: number): void {
        this.setState({
            detailVinordicenergyForAssetId: id
        });
    }

    render(): JSX.Element {
        if (this.state.detailVinordicenergyForAssetId !== null) {
            return (
                <Redirect
                    push={true}
                    to={
                        '/' +
                        this.props.baseUrl +
                        '/assets/consuming_detail_vinordicenergy/' +
                        this.state.detailVinordicenergyForAssetId
                    }
                />
            );
        }

        const defaultWidth = 106;
        const generateHeader = TableUtils.generateHeader;
        const generateFooter = TableUtils.generateFooter;

        const TableHeader: ITableHeaderData[] = [
            generateHeader('#', 60),
            generateHeader('Owner'),
            generateHeader('Facility Name'),
            generateHeader('Town, Country'),
            generateHeader('Nameplate Capacity (kW)', defaultWidth, true),
            generateHeader('Consumption (kWh)', defaultWidth, true)
        ];

        const TableFooter = [
            {
                label: 'Total',
                key: 'total',
                colspan: 5
            },
            generateFooter('Consumption (kWh)')
        ];

        const operations = ['Show Details'];

        return (
            <div className="ConsumptionWrapper">
                <AdvancedTable
                    header={TableHeader}
                    footer={TableFooter}
                    actions={true}
                    operationClicked={this.operationClicked}
                    data={this.state.formattedPaginatedData}
                    operations={operations}
                    loadPage={this.loadPage}
                    total={this.state.total}
                    pageSize={this.state.pageSize}
                    filters={this.filters}
                />
            </div>
        );
    }
}
