sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "nad/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (Controller, BaseController, JSONModel) {
    "use strict";
    return BaseController.extend("nad.controller.Logon", {
        onInit: function () {
//Set data from Local storage
            jQuery.sap.require("jquery.sap.storage");
            var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
            var oData = oStorage.get("smithfieldUserData");

            if (oData) {
                var jModel = new JSONModel(oData);
                this.getView().setModel(jModel, "offlineUser");
            }
            ;
            // attache the validation to the app
            sap.ui.getCore().attachValidationError(function (evt) {
                var control = evt.getParameter("element");
                if (control && control.setValueState) {
                    control.setValueState("Error");
                }
            });
            sap.ui.getCore().attachValidationSuccess(function (evt) {
                var control = evt.getParameter("element");
                if (control && control.setValueState) {
                    control.setValueState("None");
                }
            });
        },
        focusName: function () {
            this.getView().byId("inptLoginName").focus();
        },

        focusPass: function () {
            this.getView().byId("inptLoginPassword").focus();
        },
        updateLocalStorage: function (evt) {
            var rememberUser = evt.getParameter("selected");
            console.log("rememberUser: " + rememberUser);

            if (!rememberUser) {
                // clear local web storage if availabel
                jQuery.sap.require("jquery.sap.storage");
                var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);

                if (oStorage.get("smithfieldUserData")) {
                    oStorage.clear();
                    console.log("LocalStorage Cleared");
                }
                ;

            }
            ;
        },
        actLogin: function (evt) {
//Local data for user ID and Password
            var oLocalData = {
                    name: "",
                    password: ""
            };
            // collect input controls
            var view = this.getView();
            var inputs = [
                view.byId("inptLoginName"),
                view.byId("inptLoginPassword")
            ];

            // check that inputs are not empty
            // this does not happen during data binding as this is only triggered by
            // changes
            jQuery.each(inputs, function (i, input) {
                if (!input.getValue()) {
                    input.setValueState("Error");
                }
            });

            // check states of inputs
            var canContinue = true;
            jQuery.each(inputs, function (i, input) {
                if ("Error" === input.getValueState()) {
                    canContinue = false;
                    return false;
                }
            });

            // output result
            if (canContinue) {
                // this.nav.openDialog('Loading'); Add it later
                var oUser = this.getView().byId("inptLoginName").getValue();
                var oPass = this.getView().byId("inptLoginPassword").getValue();
                var remember = this.getView().byId("idRememberChkb").getSelected();
                //Check if data needs to be set to local storage
                if (remember) {
// clear local web storage if availabel
                    jQuery.sap.require("jquery.sap.storage");
                    var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);

                    oLocalData.name = oUser;
                    oLocalData.password = oPass;
//Update Storage
                    oStorage.put("smithfieldUserData", oLocalData);
                }
                ;
                //Go to Rate View
                this.getRouter().navTo("appRate");
            } else {
                var LoginErrorMsg = this.getView().getModel("i18n").getResourceBundle().getText("LoginErrorMsg");

                jQuery.sap.require("sap.m.MessageBox");
                sap.m.MessageBox.alert(LoginErrorMsg);
            }
        }
    });
});