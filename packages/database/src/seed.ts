import { prisma } from "./client";

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@anystore.local" },
    update: {},
    create: {
      id: "user_demo",
      email: "demo@anystore.local",
      displayName: "Demo User"
    }
  });

  const workspace = await prisma.workspace.upsert({
    where: { slug: "demo-workspace" },
    update: {},
    create: {
      id: "workspace_demo",
      name: "Demo Workspace",
      slug: "demo-workspace",
      ownerUserId: user.id
    }
  });

  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: user.id
      }
    },
    update: {},
    create: {
      id: "member_demo",
      workspaceId: workspace.id,
      userId: user.id,
      role: "owner"
    }
  });

  const app = await prisma.app.upsert({
    where: {
      workspaceId_slug: {
        workspaceId: workspace.id,
        slug: "demo-app"
      }
    },
    update: {},
    create: {
      id: "app_demo",
      workspaceId: workspace.id,
      slug: "demo-app",
      internalName: "Demo App",
      canonicalProductName: "Demo App",
      primaryLocale: "en-US",
      status: "active"
    }
  });

  await prisma.appPlatform.upsert({
    where: {
      appId_platform: {
        appId: app.id,
        platform: "ios"
      }
    },
    update: {},
    create: {
      id: "platform_ios_demo",
      appId: app.id,
      platform: "ios",
      bundleOrPackageId: "com.anystore.demo.ios",
      status: "not_connected"
    }
  });

  await prisma.appPlatform.upsert({
    where: {
      appId_platform: {
        appId: app.id,
        platform: "android"
      }
    },
    update: {},
    create: {
      id: "platform_android_demo",
      appId: app.id,
      platform: "android",
      bundleOrPackageId: "com.anystore.demo.android",
      status: "not_connected"
    }
  });

  await prisma.appLocale.upsert({
    where: {
      appId_localeCode: {
        appId: app.id,
        localeCode: "en-US"
      }
    },
    update: {},
    create: {
      id: "locale_en_us_demo",
      appId: app.id,
      localeCode: "en-US",
      status: "active"
    }
  });

  await prisma.metadataDocument.upsert({
    where: {
      appId_scopeType_scopeId: {
        appId: app.id,
        scopeType: "app_draft",
        scopeId: app.id
      }
    },
    update: {},
    create: {
      id: "metadata_draft_demo",
      appId: app.id,
      scopeType: "app_draft",
      scopeId: app.id
    }
  });

  await prisma.release.upsert({
    where: {
      appId_versionLabel: {
        appId: app.id,
        versionLabel: "1.0.0"
      }
    },
    update: {},
    create: {
      id: "release_demo",
      appId: app.id,
      versionLabel: "1.0.0",
      status: "draft",
      freezeState: "mutable",
      createdBy: user.id
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
