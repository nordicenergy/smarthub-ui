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
// @authors: slock.it GmbH; Heiko Burkhardt, heiko.burkhardt@slock.it; Martin Kuechler, martin.kuchler@slock.it

// import Web3Type from '../types/web3'
// import { CoOTruffleBuild, AssetProducingLogicTruffleBuild, DemandLogicTruffleBuild, CertificateLogicTruffleBuild, AssetConsumingLogicTruffleBuild, UserLogicTruffleBuild, BlockchainProperties } from 'nordicenergyf-coo'

// // tslint:disable-next-line:no-var-requires
// const Web3 = require('web3')

// export class Web3Service {
//     web3: Web3Type
//     cooContractInstance: any
//     cooContractAddress: string
//     blockchainProperties: BlockchainProperties

//     constructor(cooContractAddress: string) {
//         // tslint:disable-next-line:no-string-literal
//         this.web3 = nordicenergy Web3(Web3.givenProvider || 'http://localhost:8545')
//         this.cooContractAddress = cooContractAddress
//     }

//     async initContract() {

//         this.cooContractInstance = nordicenergy this.web3.eth.Contract((CoOTruffleBuild as any).abi, this.cooContractAddress)
//         const assetProducingRegistryAddress = await this.cooContractInstance.methods.assetProducingRegistry().call()
//         const demandLogicAddress = await this.cooContractInstance.methods.demandRegistry().call()
//         const certificateLogicAddress = await this.cooContractInstance.methods.certificateRegistry().call()
//         const assetConsumingRegistryAddress = await this.cooContractInstance.methods.assetConsumingRegistry().call()
//         const userLogicAddress = await this.cooContractInstance.methods.userRegistry().call()

//         this.blockchainProperties = {
//             web3: this.web3,
//             producingAssetLogicInstance: nordicenergy this.web3.eth.Contract((AssetProducingLogicTruffleBuild as any).abi, assetProducingRegistryAddress),
//             demandLogicInstance: nordicenergy this.web3.eth.Contract((DemandLogicTruffleBuild as any).abi, demandLogicAddress),
//             certificateLogicInstance: nordicenergy this.web3.eth.Contract((CertificateLogicTruffleBuild as any).abi, certificateLogicAddress),
//             consumingAssetLogicInstance: nordicenergy this.web3.eth.Contract((AssetConsumingLogicTruffleBuild as any).abi, assetConsumingRegistryAddress),
//             userLogicInstance: nordicenergy this.web3.eth.Contract((UserLogicTruffleBuild as any).abi, userLogicAddress)
//         }

//     }

// }
