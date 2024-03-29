require 'rails_helper'


RSpec.describe LinksController, type: :controller do

  let(:valid_attributes) {
    FactoryGirl.attributes_for(:link)
  }

  let(:invalid_attributes) {
    FactoryGirl.attributes_for(:link_invalid)
  }

  let(:valid_session) { {} }

  describe "GET #index" do
    it "assigns all links as @links" do
      link = Link.create! valid_attributes
      get :index, {}, valid_session
      expect(assigns(:links)).to eq([link])
    end
  end

  describe "GET #show" do
    it "assigns the requested link as @link" do
      link = Link.create! valid_attributes
      get :show, {:id => link.to_param}, valid_session
      expect(assigns(:link)).to eq(link)
    end
  end

  describe "GET #new" do
    it "assigns a new link as @link" do
      get :new, {}, valid_session
      expect(assigns(:link)).to be_a_new(Link)
    end
  end

  describe "GET #edit" do
    it "assigns the requested link as @link" do
      link = Link.create! valid_attributes
      get :edit, {:id => link.to_param}, valid_session
      expect(assigns(:link)).to eq(link)
    end
  end

  describe "POST #create" do
    context "with valid params" do
      it "creates a new Link" do
        expect {
          post :create, {:link => valid_attributes}, valid_session
        }.to change(Link, :count).by(1)
      end

      it "assigns a newly created link as @link" do
        post :create, {:link => valid_attributes}, valid_session
        expect(assigns(:link)).to be_a(Link)
        expect(assigns(:link)).to be_persisted
      end

      it "redirects to the created link" do
        post :create, {:link => valid_attributes}, valid_session
        expect(response).to redirect_to(Link.last)
      end
    end

    context "with invalid params" do
      it "assigns a newly created but unsaved link as @link" do
        post :create, {:link => invalid_attributes}, valid_session
        expect(assigns(:link)).to be_a_new(Link)
      end

      it "re-renders the 'new' template" do
        post :create, {:link => invalid_attributes}, valid_session
        expect(response).to render_template("new")
      end
    end
  end

  describe "PUT #update" do
    context "with valid params" do
      let(:new_attributes) {
        valid_attributes.update(description: 'g1')
      }

      it "updates the requested link" do
        link = Link.create! valid_attributes
        put :update, {:id => link.to_param, :link => new_attributes}, valid_session
        link.reload
        expect(link.description).to eq('g1')
      end

      it "assigns the requested link as @link" do
        link = Link.create! valid_attributes
        put :update, {:id => link.to_param, :link => valid_attributes}, valid_session
        expect(assigns(:link)).to eq(link)
      end

      it "redirects to the link" do
        link = Link.create! valid_attributes
        put :update, {:id => link.to_param, :link => valid_attributes}, valid_session
        expect(response).to redirect_to(link)
      end
    end

    context "with invalid params" do
      it "assigns the link as @link" do
        link = Link.create! valid_attributes
        put :update, {:id => link.to_param, :link => invalid_attributes}, valid_session
        expect(assigns(:link)).to eq(link)
      end

      it "re-renders the 'edit' template" do
        link = Link.create! valid_attributes
        put :update, {:id => link.to_param, :link => invalid_attributes}, valid_session
        expect(response).to render_template("edit")
      end
    end
  end

  describe "DELETE #destroy" do
    it "destroys the requested link" do
      link = Link.create! valid_attributes
      expect {
        delete :destroy, {:id => link.to_param}, valid_session
      }.to change(Link, :count).by(-1)
    end

    it "redirects to the links list" do
      link = Link.create! valid_attributes
      delete :destroy, {:id => link.to_param}, valid_session
      expect(response).to redirect_to(links_url)
    end
  end

end
