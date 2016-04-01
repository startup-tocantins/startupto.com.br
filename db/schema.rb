# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160401164749) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "links", force: :cascade do |t|
    t.string   "kind"
    t.string   "url"
    t.string   "description"
    t.integer  "startup_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "links", ["startup_id"], name: "index_links_on_startup_id", using: :btree

  create_table "media", force: :cascade do |t|
    t.string   "kind"
    t.string   "url"
    t.string   "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "startups", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.string   "logo"
    t.string   "category"
    t.string   "stage"
    t.string   "country"
    t.string   "state"
    t.string   "city"
    t.string   "site"
    t.string   "contact"
    t.string   "latitude"
    t.string   "longitude"
    t.string   "group"
    t.date     "fundation"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "team_members", force: :cascade do |t|
    t.string   "nome"
    t.string   "email"
    t.string   "linkedin"
    t.string   "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "links", "startups"
end
