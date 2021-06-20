/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const states = ["Init", "ClaimFiled", "LossReported", "FaultDetermined", "Paid"];
class Insurance extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const reports = [
            {
                currentState: 4,
                userName: "Dave Kiston",
                policyNumber: '001',
                make: 'Toyota',
                model: 'Prius',
                year: '2020',
                plate: 'ABC2222',
                details: 'Josh Lee, a freight handler in XYZ Shipping Lines, was exposed to carbon monoxide fumes on December 2, 2017, Tuesday, from (estimated) 7:30 AM to 11:30 AM. He was at the unloading bay B, helping unload some freight from various containers with the help of two forklift operators: Kit Stevens and Donald Summers, neither of which complained of symptoms',
                injury: 'None',
                passengerNumber: 5,
                damage : "A",
                accidentDescription : "I pulled away from the side of the road, glanced at my mother-in-law and headed over the embankment.",
                driverLicenceNumber : "123456789",
                unsuranceCompany : "RBC insurance",
                officerBadgeNumber: "987654",
                lossAmount: 20010,
                fault: 50,
                paidAmount: 10005,

            },
            
        ];

        for (let i = 0; i < reports.length; i++) {
            reports[i].docType = 'accidentReport';
            await ctx.stub.putState('REPORT' + i, Buffer.from(JSON.stringify(reports[i])));
            console.info('Added <--> ', reports[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryReport(ctx, reportNumber) {
        const reportAsBytes = await ctx.stub.getState(reportNumber); // get the car from chaincode state
        if (!reportAsBytes || reportAsBytes.length === 0) {
            throw new Error(`${reportNumber} does not exist`);
        }
        console.log(reportAsBytes.toString());
        return reportAsBytes.toString();
    }

    async createReport(ctx, reportNumber, make, model, year, userName) {
        console.info('============= START : Create Report ===========');

        const report = {
            docType: 'accidentReport',
            currentState: 1,
            make,
            model,
            year,
            userName,
        };

        await ctx.stub.putState(reportNumber, Buffer.from(JSON.stringify(report)));
        console.info('============= END : Create Report ===========');
    }

    async queryAllReports(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }


    async proofOfLoss(ctx, reportNumber, amount) {
        console.info('============= START : proofOfLoss ===========');

        const reportAsBytes = await ctx.stub.getState(reportNumber); // get the report from chaincode state
        if (!reportAsBytes || reportAsBytes.length === 0) {
            throw new Error(`${reportNumber} does not exist`);
        }
        const report = JSON.parse(reportAsBytes.toString());
        if(report.currentState !== 1){
            throw new Error(`${reportNumber} has invalid state to claim loss`);
        }
        report.currentState = 2;
        report.lossAmount = Number(amount);

        await ctx.stub.putState(reportNumber, Buffer.from(JSON.stringify(report)));
        console.info('============= END : proofOfLoss ===========');
    }

    async determineFault(ctx, reportNumber, faultPercentage) {
        console.info('============= START : determineFault ===========');

        const reportAsBytes = await ctx.stub.getState(reportNumber); // get the report from chaincode state
        if (!reportAsBytes || reportAsBytes.length === 0) {
            throw new Error(`${reportNumber} does not exist`);
        }
        const report = JSON.parse(reportAsBytes.toString());
        if(report.currentState !== 2){
            throw new Error(`${reportNumber} has invalid state to claim loss`);
        }
        report.fault = parseInt(faultPercentage);
        report.currentState = 3;

        await ctx.stub.putState(reportNumber, Buffer.from(JSON.stringify(report)));
        console.info('============= END : determineFault ===========');
    }

    async payClaim(ctx, reportNumber, amount) {
        console.info('============= START : determineFault ===========');

        const reportAsBytes = await ctx.stub.getState(reportNumber); // get the report from chaincode state
        if (!reportAsBytes || reportAsBytes.length === 0) {
            throw new Error(`${reportNumber} does not exist`);
        }
        const report = JSON.parse(reportAsBytes.toString());
        if(report.currentState !== 3){
            throw new Error(`${reportNumber} has invalid state to claim loss`);
        }
        report.paidAmount = Number(amount);
        report.currentState = 4;

        await ctx.stub.putState(reportNumber, Buffer.from(JSON.stringify(report)));
        console.info('============= END : determineFault ===========');
    }

}

module.exports = Insurance;
