sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "nad/controller/BaseController",
    "sap/m/Dialog",
    "sap/m/Text",
    "sap/m/Button",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel"
], function (Controller, BaseController, Dialog, Text, Button, MessageToast, ODataModel, JSONModel) {
    "use strict";
    return BaseController.extend("nad.controller.Rate", {
        onInit: function () {
            var sAction = "G";
            //Read Proposal number from url Parameter
            var sProposalNo = jQuery.sap.getUriParameters().get("proposalno");
            //Get user and password from local storage
            jQuery.sap.require("jquery.sap.storage");
            var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
            var oData = oStorage.get("smithfieldUserData");
            //Call OData to get data from SAP
            var sUrl = "/sap/opu/odata/SAP/ZGW_CONTRACT_RATE_SRV/";
            var oRateModel = new sap.ui.model.odata.ODataModel(sUrl, oData.name, oData.password, true);
            this.getView().setModel(oRateModel, 'Rate');
            //get PDF data
            var pUrl = "/ContractRates(proposalNo='" + sProposalNo + "',action='" + sAction + "')/$value";
            var oJdata = this.readOData(oRateModel, pUrl);
            this._pdfUrl = oJdata.pdfUrl;
        },
        //Set CSS style for diffrent Devices
        onAfterRendering: function () {
            var pdfUrl = this._pdfUrl;

            $("iframe").attr("src", pdfUrl);


            $(function () {

                if (/iPhone|iPod|iPad/.test(navigator.userAgent)) {

                    $("#divPdf").css({

                        'overflow': 'scroll',

                        'width': '100%',

                        'height': isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight,

                        'position': 'absolute',

                        '-webkit-overflow-scrolling': 'touch'

                    });

                }

                else {

                    $("#divPdf").css({

                        'overflow': 'scroll',

                        'width': '100%',

                        'height': isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight,

                        'position': 'absolute',

                        '-webkit-overflow-scrolling': 'auto'

                    });

                }

            });

        },
        //Approve
        onAccept: function () {
            var that = this;
            var dialog = new Dialog({
                title: 'Alert',
                type: 'Message',
                state: 'Warning',
                content: new Text({
                    text: 'Do you wish to Approve?'
                }),
                beginButton: new Button({
                    text: 'Yes',
                    press: function () {
                        dialog.close();
//Approve
                        var sAction = "A";
                        //Read Proposal number from url Parameter
                        var sProposalNo = jQuery.sap.getUriParameters().get("proposalno");
//Send Approve request
                        var pUrl = "/ContractRates(proposalNo='" + sProposalNo + "',action='" + sAction + "')";
                        var oJdata = that.readOData(that.getView().getModel("Rate"), pUrl);
                        var sMsg = oJdata.jData.message;
//get PDF data
                        pUrl = "/ContractRates(proposalNo='" + sProposalNo + "',action='" + sAction + "')/$value";
                        oJdata = that.readOData(that.getView().getModel("Rate"), pUrl);
                        this._pdfUrl = oJdata.pdfUrl;
                        MessageToast.show(sMsg);
                    }
                }),
                endButton: new Button({
                    text: 'No',
                    press: function () {
                        dialog.close();
                        MessageToast.show("Action Cancelled");
                    }
                }),
                afterClose: function () {
                    dialog.destroy();
                }
            });

            dialog.open();
        },
        //Reject
        onReject: function () {
            var that = this;
            var dialog = new Dialog({
                title: 'Alert',
                type: 'Message',
                state: 'Warning',
                content: new Text({
                    text: 'Do you wish to Reject?'
                }),
                beginButton: new Button({
                    text: 'Yes',
                    press: function () {
                        dialog.close();
//Reject
                        var sAction = "R";
                        //Read Proposal number from url Parameter
                        var sProposalNo = jQuery.sap.getUriParameters().get("proposalno");
//Send Reject request
                        var pUrl = "/ContractRates(proposalNo='" + sProposalNo + "',action='" + sAction + "')";
                        var oJdata = that.readOData(that.getView().getModel("Rate"), pUrl);
                        var sMsg = oJdata.jData.message;
//get PDF data
                        pUrl = "/ContractRates(proposalNo='" + sProposalNo + "',action='" + sAction + "')/$value";
                        oJdata = that.readOData(that.getView().getModel("Rate"), pUrl);
                        this._pdfUrl = oJdata.pdfUrl;
                        MessageToast.show(sMsg);
                    }
                }),
                endButton: new Button({
                    text: 'No',
                    press: function () {
                        dialog.close();
                        MessageToast.show("Action Cancelled");
                    }
                }),
                afterClose: function () {
                    dialog.destroy();
                }
            });

            dialog.open();
        },
        //Read OData
        readOData: function (oModel, sUrl) {
            var oJData = {
                jData: "",
                pdfUrl: ""
            };
            var data = oModel.read(sUrl,
                null,
                null,
                false,
                function (oData, oResponse) {
                    oJData.jData = oData;
                    oJData.pdfUrl = oResponse.requestUri
                    console.log(oResponse);
                }
            );
            return oJData;
        }
    });
});