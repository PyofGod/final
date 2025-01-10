import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    KeycloakProvider({
      clientId: "express-client",
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
      issuer: `${process.env.KEYCLOAK_URL}/realms/${process.env.REALM_NAME}`, // ใช้ URL และ Realm จาก .env
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      // แปลง profile เป็นประเภทที่เราคาดหวัง
      const keycloakProfile = profile as {
        given_name?: string;
        family_name?: string;
      };

      // เข้าถึงข้อมูลจาก profile
      const firstName = keycloakProfile.given_name ?? "";
      const lastName = keycloakProfile.family_name ?? "";
      const username = user.name ?? "";

      // บันทึกข้อมูลใน Prisma
      await prisma.keycloakUser.upsert({
        where: { id: user.id },
        create: {
          id: user.id,
          email: user.email ?? "",
          username,
          firstName,
          lastName,
        },
        update: {
          email: user.email ?? "",
          username,
          firstName,
          lastName,
        },
      });
      console.log("User:", user); // ข้อมูลผู้ใช้จาก Keycloak
      console.log("Profile:", profile); // ข้อมูลเพิ่มเติมจาก Keycloak (เช่น email, firstName, etc.)
      return true;
    },
  },
});
