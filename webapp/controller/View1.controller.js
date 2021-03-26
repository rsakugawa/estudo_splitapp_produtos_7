	sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
		/**
		 * @param {typeof sap.ui.core.mvc.Controller} Controller
		 */
		function (Controller) {
			"use strict";
	
			return Controller.extend("estudosplitappprodutos.controller.View1", {
	
				oList: null,
				oPageDetail: null,
	
				onInit: function () {
					this.oList = this.byId("list");
					this.oPageDetail = this.byId("page-detail");
	
				},
	
				onItemPress: function(oEvent){
					var oSource = oEvent.getSource();
					var oParameters = oEvent.getParameters();
					var oListItem = oParameters.listItem;
	
					// Armazena contexto do listItem clicado (/Products('HT-1000'))
					var oContext = oListItem.getBindingContext();
	
					// Busca "header" que é o Id do cabeçalho do Details e
					// seta o contexto do binding
					//this.byId("header").setBindingContext(oContext);
					// Comentado acima, pq foi setado o contexto na pagina details inteira (ver abaixo)
	
					this.oPageDetail.setBindingContext(oContext); 
	
				},
	
				// Evento do Search Field
				onLiveChange: function(oEvent){
					
					var aFilter = [];
					var sNewValue = oEvent.getParameters().newValue;
					if(sNewValue){
						aFilter.push(
							new sap.ui.model.Filter({
								path: "Name",
								operator: sap.ui.model.FilterOperator.Contains,
								value1: sNewValue
							})
						);
					}
	
					var oBinding = this.oList.getBinding("items"); // sap.ui.model.odata.v2.ODataListBinding
	
					oBinding.filter(aFilter);
				},
	
				// EXEMPLO DE CREATE // CLICA NO BOTÃO SAVE DA PAGINA DE DETALHE
				onSubmitReview: function(oEvent){
	
					var oDataModel = this.getOwnerComponent().getModel();
	
					// 1. Pega contexto da pagina de detalhes
					var oContext = this.oPageDetail.getBindingContext();
	
					// 2. Busca Id do produto dentro do contexto
					var sProductId = oContext.getObject().Id;
					// Outra forma de pegar o Id
					// var sProductId = oContext.getProperty("Id");
	
					// 3. Cria array para inserir valores (campos no entityset)
					var oReview = {};
					oReview.ProductId = sProductId;
					oReview.Rating = this.byId("rating").getValue();
					oReview.Comment = this.byId("comment").getValue();;
	
					// Define busy do botão, será desbloqueado após retorno da chamada
					oEvent.getSource().setBusy(true);
	
				   // Cria parameters para receber sucesso/erro
				   var oButton = oEvent.getSource(); // Outra forma de incluir o this ..ver no error
				   
					var mParameters = {
						success: function(oData, response){
							sap.m.MessageToast.show("sucesso"); 
							this.setBusy(false);
	
						}.bind(oEvent.getSource()), //forçando o this dentro do callback
	
						error: function(oError){
							sap.m.MessageToast.show("erro");
							oButton.setBusy(false);
						}
					};     
	
					// Metodo create, vai retornar 202 
					oDataModel.create("/Reviews", oReview, mParameters);
	
				}, // Fim onSubmitReview
	
				// EXEMPLO DE UPDATE // EVENTO DA ESTRELA NO RODAPÉ
				onFavorite: function(oEvent){
					// Verifica se o botão já está pressionado
					 var oParameters = oEvent.getParameters();
					 var bPressed = oParameters.pressed;
	
					 var oDataModel = this.getOwnerComponent().getModel();
	
					 // Busca o "filtro" do contexto da pagina details   
					 var sPath = this.oPageDetail.getBindingContext().getPath();
					 
					 // Cria oProduct com o campo que será atualizado (ver no entityset)
					 var oProduct = {
						IsFavoriteOfCurrentUser: bPressed
					 };
					 //mParameters dá para fazer o call back igual o create..identico
					 var mParameters = {};
	
					 oDataModel.update(sPath, oProduct, mParameters);
	
				}
	
			});
		});
	

