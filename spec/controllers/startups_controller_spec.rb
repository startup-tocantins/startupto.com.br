require 'rails_helper'

RSpec.describe StartupsController, type: :controller do

  let(:valid_attributes) {
    FactoryGirl.attributes_for(:startup)
  }

  let(:invalid_attributes) {
    FactoryGirl.attributes_for(:startup_invalid)
  }

  let(:valid_session) { {} }

  describe "GET #index" do
    it "assigns all startups as @startups" do
      startup = Startup.create! valid_attributes
      get :index, {}, valid_session
      expect(assigns(:startups)).to eq([startup])
    end
  end

  describe "GET #show" do
    it "assigns the requested startup as @startup" do
      startup = Startup.create! valid_attributes
      get :show, {:id => startup.to_param}, valid_session
      expect(assigns(:startup)).to eq(startup)
    end
  end

  describe "GET #new" do
    it "assigns a new startup as @startup" do
      get :new, {}, valid_session
      expect(assigns(:startup)).to be_a_new(Startup)
    end
  end

  describe "GET #edit" do
    it "assigns the requested startup as @startup" do
      startup = Startup.create! valid_attributes
      get :edit, {:id => startup.to_param}, valid_session
      expect(assigns(:startup)).to eq(startup)
    end
  end

  describe "POST #create" do
    context "with valid params" do
      it "creates a new Startup" do
        expect {
          post :create, {:startup => valid_attributes}, valid_session
        }.to change(Startup, :count).by(1)
      end

      it "assigns a newly created startup as @startup" do
        post :create, {:startup => valid_attributes}, valid_session
        expect(assigns(:startup)).to be_a(Startup)
        expect(assigns(:startup)).to be_persisted
      end

      it "redirects to the created startup" do
        post :create, {:startup => valid_attributes}, valid_session
        expect(response).to redirect_to(Startup.last)
      end
    end

    context "with invalid params" do
      it "assigns a newly created but unsaved startup as @startup" do
        post :create, {:startup => invalid_attributes}, valid_session
        expect(assigns(:startup)).to be_a_new(Startup)
      end

      it "re-renders the 'new' template" do
        post :create, {:startup => invalid_attributes}, valid_session
        expect(response).to render_template("new")
      end
    end
  end

  describe "PUT #update" do
    context "with valid params" do
      let(:new_attributes) {
        valid_attributes.update(name: 'Google')
      }

      it "updates the requested startup" do
        startup = Startup.create! valid_attributes
        put :update, {:id => startup.to_param, :startup => new_attributes}, valid_session
        startup.reload
        expect(startup.name).to eq('Google')
      end

      it "assigns the requested startup as @startup" do
        startup = Startup.create! valid_attributes
        put :update, {:id => startup.to_param, :startup => valid_attributes}, valid_session
        expect(assigns(:startup)).to eq(startup)
      end

      it "redirects to the startup" do
        startup = Startup.create! valid_attributes
        put :update, {:id => startup.to_param, :startup => valid_attributes}, valid_session
        expect(response).to redirect_to(startup)
      end
    end

    context "with invalid params" do
      it "assigns the startup as @startup" do
        startup = Startup.create! valid_attributes
        put :update, {:id => startup.to_param, :startup => invalid_attributes}, valid_session
        expect(assigns(:startup)).to eq(startup)
      end

      it "re-renders the 'edit' template" do
        startup = Startup.create! valid_attributes
        put :update, {:id => startup.to_param, :startup => invalid_attributes}, valid_session
        expect(response).to render_template("edit")
      end
    end
  end

  describe "DELETE #destroy" do
    it "destroys the requested startup" do
      startup = Startup.create! valid_attributes
      expect {
        delete :destroy, {:id => startup.to_param}, valid_session
      }.to change(Startup, :count).by(-1)
    end

    it "redirects to the startups list" do
      startup = Startup.create! valid_attributes
      delete :destroy, {:id => startup.to_param}, valid_session
      expect(response).to redirect_to(startups_url)
    end
  end

end
