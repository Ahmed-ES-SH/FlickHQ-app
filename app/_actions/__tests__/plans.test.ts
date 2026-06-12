import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/_helpers/globalRequest", () => ({
  globalRequest: vi.fn(),
}));

import { globalRequest } from "@/app/_helpers/globalRequest";
import { API_ENDPOINTS } from "@/app/constants/apis";
import {
  fetchPlansAction,
  fetchCurrentSubscriptionAction,
  fetchSubscriptionHistoryAction,
  fetchSubscriptionTimelineAction,
  fetchPaymentHistoryAction,
  fetchPaymentDetailAction,
  createSubscriptionCheckoutAction,
  createEmbeddedCheckoutSessionAction,
  createOneTimeCheckoutAction,
  createPortalSessionAction,
  createSubscriptionAction,
  ensureBillingCustomerAction,
  fetchAdminPlansAction,
  fetchAdminPlanDetailAction,
  createAdminPlanAction,
  updateAdminPlanAction,
  archiveAdminPlanAction,
  addAdminPriceAction,
  fetchAdminPricesAction,
  deactivateAdminPriceAction,
} from "@/app/_actions/plans";
import type { PlanResponseDto } from "@/app/types/subscriptions";
import {
  BillingPlanStatus,
  BillingPriceType,
  BillingRecurringInterval,
} from "@/app/types/subscriptions";

const mockedGlobalRequest = vi.mocked(globalRequest);

const fakePlan: PlanResponseDto = {
  id: "plan-1",
  code: "pro_monthly",
  name: "Pro",
  description: "Pro features",
  features: ["premium_reports"],
  displayOrder: 0,
  icon: null,
  highlight: true,
  status: BillingPlanStatus.ACTIVE,
  prices: [
    {
      id: "price-1",
      planId: "plan-1",
      stripePriceId: "price_1ABC",
      stripeProductId: "prod_1ABC",
      currency: "usd",
      unitAmount: 1900,
      type: BillingPriceType.RECURRING,
      interval: BillingRecurringInterval.MONTH,
      trialPeriodDays: 7,
      active: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
  ],
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

beforeEach(() => {
  mockedGlobalRequest.mockReset();
});

describe("fetchPlansAction", () => {
  it("fetches public plans with authenticated: false", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: [fakePlan],
      statusCode: 200,
      message: "ok",
    });

    const res = await fetchPlansAction();

    expect(mockedGlobalRequest).toHaveBeenCalledWith({
      endpoint: API_ENDPOINTS.PLANS.list,
      method: "GET",
      authenticated: false,
      defaultErrorMessage: "Failed to fetch plans",
    });
    expect(res.success).toBe(true);
    expect(res.data).toEqual([fakePlan]);
  });

  it("returns empty array on success with no data", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: undefined,
      statusCode: 200,
      message: "ok",
    });

    const res = await fetchPlansAction();
    expect(res.success).toBe(true);
    expect(res.data).toEqual([]);
  });

  it("returns error result on failure", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: false,
      message: "Server error",
      statusCode: 500,
    });

    const res = await fetchPlansAction();
    expect(res.success).toBe(false);
    expect(res.message).toBe("Server error");
  });
});

describe("fetchCurrentSubscriptionAction", () => {
  it("returns subscription data on success", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: { id: "sub-1", status: "active" },
      statusCode: 200,
      message: "ok",
    });

    const res = await fetchCurrentSubscriptionAction();
    expect(res.success).toBe(true);
    expect(res.data).toEqual({ id: "sub-1", status: "active" });
  });

  it("returns null on 404 (no active subscription)", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: false,
      message: "Not found",
      statusCode: 404,
    });

    const res = await fetchCurrentSubscriptionAction();
    expect(res.success).toBe(true);
    expect(res.data).toBeNull();
  });

  it("returns error for non-404 failures", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: false,
      message: "Unauthorized",
      statusCode: 401,
    });

    const res = await fetchCurrentSubscriptionAction();
    expect(res.success).toBe(false);
    expect(res.message).toBe("Unauthorized");
  });
});

describe("fetchSubscriptionHistoryAction", () => {
  it("includes pagination query params", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: [],
      statusCode: 200,
      message: "ok",
      meta: { page: 1, limit: 10, lastPage: 1, perPage: 10, total: 0 },
    });

    const res = await fetchSubscriptionHistoryAction(1, 10);
    expect(res.success).toBe(true);
    expect(mockedGlobalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: `${API_ENDPOINTS.SUBSCRIPTIONS.history}?page=1&limit=10`,
      }),
    );
  });

  it("uses defaults when no args provided", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: [],
      statusCode: 200,
      message: "ok",
    });

    const res = await fetchSubscriptionHistoryAction();
    expect(res.success).toBe(true);
    expect(mockedGlobalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: `${API_ENDPOINTS.SUBSCRIPTIONS.history}?page=1&limit=20`,
      }),
    );
  });
});

describe("fetchSubscriptionTimelineAction", () => {
  it("fetches timeline for a subscription", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: [{ id: "entry-1", previousStatus: "trialing", newStatus: "active" }],
      statusCode: 200,
      message: "ok",
    });

    const res = await fetchSubscriptionTimelineAction("sub-1");
    expect(mockedGlobalRequest).toHaveBeenCalledWith({
      endpoint: API_ENDPOINTS.SUBSCRIPTIONS.historyDetail("sub-1"),
      method: "GET",
      defaultErrorMessage: "Failed to fetch subscription timeline",
    });
    expect(res.success).toBe(true);
    expect(res.data).toHaveLength(1);
  });
});

describe("fetchPaymentHistoryAction", () => {
  it("fetches paginated payment history", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: [],
      statusCode: 200,
      message: "ok",
    });

    const res = await fetchPaymentHistoryAction(2, 10);
    expect(res.success).toBe(true);
    expect(mockedGlobalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: `${API_ENDPOINTS.PAYMENTS.history}?page=2&limit=10`,
      }),
    );
  });
});

describe("fetchPaymentDetailAction", () => {
  it("fetches a single payment by ID", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: { id: "pay-1", amount: 1900 },
      statusCode: 200,
      message: "ok",
    });

    const res = await fetchPaymentDetailAction("pay-1");
    expect(res.success).toBe(true);
    expect(res.data).toEqual({ id: "pay-1", amount: 1900 });
  });
});

describe("createSubscriptionCheckoutAction", () => {
  it("creates a checkout session with idempotency key", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: { sessionId: "cs_test", url: "https://checkout.stripe.com/" },
      statusCode: 200,
      message: "ok",
    });

    const res = await createSubscriptionCheckoutAction("price-1", {
      idempotencyKey: "uuid-1",
      successUrl: "https://example.com/success",
    });

    expect(mockedGlobalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: API_ENDPOINTS.BILLING.checkoutSubscription,
        method: "POST",
        body: {
          priceId: "price-1",
          uiMode: "hosted_page",
          successUrl: "https://example.com/success",
        },
        headers: { "Idempotency-Key": "uuid-1" },
      }),
    );
    expect(res.success).toBe(true);
    expect(res.data?.url).toBe("https://checkout.stripe.com/");
  });

  it("returns error when no data returned", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: null,
      statusCode: 200,
      message: "ok",
    });

    const res = await createSubscriptionCheckoutAction("price-1");
    expect(res.success).toBe(false);
  });
});

describe("createEmbeddedCheckoutSessionAction", () => {
  it("sends uiMode: embedded_page with idempotency key and returns clientSecret", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: { sessionId: "cs_test", clientSecret: "cs_test_secret_xxx" },
      statusCode: 200,
      message: "ok",
    });

    const res = await createEmbeddedCheckoutSessionAction("price-1", {
      idempotencyKey: "uuid-1",
    });

    expect(mockedGlobalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: API_ENDPOINTS.BILLING.checkoutSubscription,
        method: "POST",
        body: { priceId: "price-1", uiMode: "embedded_page" },
        headers: { "Idempotency-Key": "uuid-1" },
      }),
    );
    expect(res.success).toBe(true);
    expect(res.data?.sessionId).toBe("cs_test");
    expect(res.data?.clientSecret).toBe("cs_test_secret_xxx");
  });

  it("works without optional fields", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: { sessionId: "cs_test_2", clientSecret: "secret_2" },
      statusCode: 200,
      message: "ok",
    });

    const res = await createEmbeddedCheckoutSessionAction("price-2");
    expect(mockedGlobalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: API_ENDPOINTS.BILLING.checkoutSubscription,
        method: "POST",
        body: { priceId: "price-2", uiMode: "embedded_page" },
        headers: undefined,
      }),
    );
    expect(res.success).toBe(true);
    expect(res.data?.clientSecret).toBe("secret_2");
  });

  it("returns error when no data returned", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: null,
      statusCode: 200,
      message: "ok",
    });

    const res = await createEmbeddedCheckoutSessionAction("price-1");
    expect(res.success).toBe(false);
  });

  it("returns error on failure", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: false,
      message: "Conflict",
      statusCode: 409,
    });

    const res = await createEmbeddedCheckoutSessionAction("price-1");
    expect(res.success).toBe(false);
    expect(res.statusCode).toBe(409);
  });
});

describe("createOneTimeCheckoutAction", () => {
  it("creates a one-time checkout session", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: { sessionId: "cs_test_2", url: "https://checkout.stripe.com/" },
      statusCode: 200,
      message: "ok",
    });

    const res = await createOneTimeCheckoutAction("price-2");
    expect(mockedGlobalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: API_ENDPOINTS.BILLING.checkoutOneTime,
        method: "POST",
      }),
    );
    expect(res.success).toBe(true);
  });
});

describe("createPortalSessionAction", () => {
  it("creates a portal session with idempotency key", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: { url: "https://billing.stripe.com/" },
      statusCode: 200,
      message: "ok",
    });

    const res = await createPortalSessionAction({ idempotencyKey: "uuid-2" });
    expect(mockedGlobalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: API_ENDPOINTS.BILLING.portalSession,
        method: "POST",
        headers: { "Idempotency-Key": "uuid-2" },
      }),
    );
    expect(res.success).toBe(true);
    expect(res.data?.url).toBe("https://billing.stripe.com/");
  });
});

describe("createSubscriptionAction", () => {
  it("creates subscription with valid paymentIntentId", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: { subscriptionId: "sub_123", status: "active" },
      statusCode: 200,
      message: "ok",
    });

    const res = await createSubscriptionAction("pi_xxx", "idempotency-key-1");

    expect(mockedGlobalRequest).toHaveBeenCalledWith({
      endpoint: API_ENDPOINTS.SUBSCRIPTIONS.create,
      method: "POST",
      body: { paymentIntentId: "pi_xxx" },
      headers: { "Idempotency-Key": "idempotency-key-1" },
      defaultErrorMessage: "Failed to create subscription",
    });
    expect(res.success).toBe(true);
    expect(res.data?.subscriptionId).toBe("sub_123");
    expect(res.data?.status).toBe("active");
  });

  it("works without idempotency key", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: { subscriptionId: "sub_456", status: "trialing" },
      statusCode: 200,
      message: "ok",
    });

    const res = await createSubscriptionAction("pi_yyy");

    expect(mockedGlobalRequest).toHaveBeenCalledWith({
      endpoint: API_ENDPOINTS.SUBSCRIPTIONS.create,
      method: "POST",
      body: { paymentIntentId: "pi_yyy" },
      headers: undefined,
      defaultErrorMessage: "Failed to create subscription",
    });
    expect(res.success).toBe(true);
  });

  it("returns success on 409 (Idempotency-Key reused)", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: false,
      data: { subscriptionId: "sub_123", status: "active" },
      statusCode: 409,
      message: "Idempotency-Key already used",
    });

    const res = await createSubscriptionAction("pi_xxx", "reused-key");

    expect(res.success).toBe(true);
    expect(res.message).toBe("Subscription already exists");
    expect(res.data?.subscriptionId).toBe("sub_123");
  });

  it("returns error on 4xx failure", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: false,
      message: "Payment intent not found",
      statusCode: 400,
    });

    const res = await createSubscriptionAction("pi_bad");

    expect(res.success).toBe(false);
    expect(res.message).toBe("Payment intent not found");
    expect(res.statusCode).toBe(400);
  });

  it("returns error when API call fails", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: false,
      message: "Internal server error",
      statusCode: 500,
    });

    const res = await createSubscriptionAction("pi_fail");

    expect(res.success).toBe(false);
    expect(res.message).toBe("Internal server error");
    expect(res.statusCode).toBe(500);
  });
});

describe("ensureBillingCustomerAction", () => {
  it("returns billing customer data", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: { id: "cust-1", email: "user@example.com", name: null, stripeCustomerId: "cus_xxx" },
      statusCode: 200,
      message: "ok",
    });

    const res = await ensureBillingCustomerAction();
    expect(res.success).toBe(true);
    expect(res.data?.email).toBe("user@example.com");
  });
});

// ────────────────────────────
// Admin Actions
// ────────────────────────────

describe("fetchAdminPlansAction", () => {
  it("fetches all plans when no status filter", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: [fakePlan],
      statusCode: 200,
      message: "ok",
    });

    const res = await fetchAdminPlansAction();
    expect(mockedGlobalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: API_ENDPOINTS.ADMIN_PLANS.list,
        method: "GET",
      }),
    );
    expect(res.success).toBe(true);
    expect(res.data).toHaveLength(1);
  });

  it("includes status query param when provided", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: [fakePlan],
      statusCode: 200,
      message: "ok",
    });

    await fetchAdminPlansAction("active");
    expect(mockedGlobalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: `${API_ENDPOINTS.ADMIN_PLANS.list}?status=active`,
      }),
    );
  });
});

describe("fetchAdminPlanDetailAction", () => {
  it("fetches a single plan by ID", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: fakePlan,
      statusCode: 200,
      message: "ok",
    });

    const res = await fetchAdminPlanDetailAction("plan-1");
    expect(mockedGlobalRequest).toHaveBeenCalledWith({
      endpoint: API_ENDPOINTS.ADMIN_PLANS.detail("plan-1"),
      method: "GET",
      defaultErrorMessage: "Failed to fetch plan details",
    });
    expect(res.success).toBe(true);
    expect(res.data?.id).toBe("plan-1");
  });
});

describe("createAdminPlanAction", () => {
  it("creates a plan and returns the plan object", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: { plan: fakePlan },
      statusCode: 201,
      message: "Created",
    });

    const res = await createAdminPlanAction({
      code: "pro_monthly",
      name: "Pro",
    });

    expect(mockedGlobalRequest).toHaveBeenCalledWith({
      endpoint: API_ENDPOINTS.ADMIN_PLANS.create,
      method: "POST",
      body: { code: "pro_monthly", name: "Pro" },
      defaultErrorMessage: "Failed to create plan",
    });
    expect(res.success).toBe(true);
    expect(res.data?.name).toBe("Pro");
  });

  it("returns error on failure", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: false,
      message: "Conflict",
      statusCode: 409,
    });

    const res = await createAdminPlanAction({ code: "pro", name: "Pro" });
    expect(res.success).toBe(false);
    expect(res.statusCode).toBe(409);
  });
});

describe("updateAdminPlanAction", () => {
  it("updates a plan and returns updated plan", async () => {
    const updatedPlan = { ...fakePlan, name: "Pro Plus" };
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: { plan: updatedPlan },
      statusCode: 200,
      message: "Updated",
    });

    const res = await updateAdminPlanAction("plan-1", { name: "Pro Plus" });
    expect(mockedGlobalRequest).toHaveBeenCalledWith({
      endpoint: API_ENDPOINTS.ADMIN_PLANS.update("plan-1"),
      method: "PATCH",
      body: { name: "Pro Plus" },
      defaultErrorMessage: "Failed to update plan",
    });
    expect(res.success).toBe(true);
    expect(res.data?.name).toBe("Pro Plus");
  });
});

describe("archiveAdminPlanAction", () => {
  it("archives a plan", async () => {
    const archivedPlan = { ...fakePlan, status: "archived" as const };
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: { plan: archivedPlan },
      statusCode: 200,
      message: "Archived",
    });

    const res = await archiveAdminPlanAction("plan-1");
    expect(mockedGlobalRequest).toHaveBeenCalledWith({
      endpoint: API_ENDPOINTS.ADMIN_PLANS.archive("plan-1"),
      method: "POST",
      defaultErrorMessage: "Failed to archive plan",
    });
    expect(res.success).toBe(true);
    expect(res.data?.status).toBe("archived");
  });
});

describe("addAdminPriceAction", () => {
  it("adds a price to a plan", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: { id: "price-new", unitAmount: 1900 },
      statusCode: 201,
      message: "Created",
    });

    const res = await addAdminPriceAction("plan-1", {
      stripePriceId: "price_1XYZ",
      currency: "usd",
      unitAmount: 1900,
      type: BillingPriceType.RECURRING,
      interval: BillingRecurringInterval.MONTH,
    });

    expect(mockedGlobalRequest).toHaveBeenCalledWith({
      endpoint: API_ENDPOINTS.ADMIN_PLANS.addPrice("plan-1"),
      method: "POST",
      body: {
        stripePriceId: "price_1XYZ",
        currency: "usd",
        unitAmount: 1900,
        type: "recurring",
        interval: "month",
      },
      defaultErrorMessage: "Failed to add price",
    });
    expect(res.success).toBe(true);
    expect(res.data?.id).toBe("price-new");
  });
});

describe("fetchAdminPricesAction", () => {
  it("fetches prices for a plan", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: [fakePlan.prices[0]],
      statusCode: 200,
      message: "ok",
    });

    const res = await fetchAdminPricesAction("plan-1");
    expect(mockedGlobalRequest).toHaveBeenCalledWith({
      endpoint: API_ENDPOINTS.ADMIN_PLANS.listPrices("plan-1"),
      method: "GET",
      defaultErrorMessage: "Failed to fetch prices",
    });
    expect(res.success).toBe(true);
    expect(res.data).toHaveLength(1);
  });
});

describe("deactivateAdminPriceAction", () => {
  it("deactivates a price", async () => {
    const deactivatedPrice = { id: "price-1", active: false };
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      data: deactivatedPrice,
      statusCode: 200,
      message: "Updated",
    });

    const res = await deactivateAdminPriceAction("price-1");
    expect(mockedGlobalRequest).toHaveBeenCalledWith({
      endpoint: API_ENDPOINTS.ADMIN_PLANS.deactivatePrice("price-1"),
      method: "PATCH",
      defaultErrorMessage: "Failed to deactivate price",
    });
    expect(res.success).toBe(true);
    expect(res.data?.active).toBe(false);
  });
});
