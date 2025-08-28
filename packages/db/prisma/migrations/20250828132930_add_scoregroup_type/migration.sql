/*
  Warnings:

  - Added the required column `type` to the `score_groups` table with a default value 'GENERAL'. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "score_groups" ADD COLUMN "type" VARCHAR(10) NOT NULL DEFAULT 'GENERAL';
