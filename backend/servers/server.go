package servers

import (
    "bytes"
    "encoding/json"
    "io"
    "log"
    "net/http"

    "github.com/stripe/stripe-go/v81/paymentmethod"
    "github.com/stripe/stripe-go/v81"
    "github.com/stripe/stripe-go/v81/paymentintent"
)


func Server() {
	// This is your test secret API key.
	stripe.Key = "sk_test_51QOxoF4QmAAjQ0QzRU7xd3EvUavL5UHSMYsKbHwizgnrVvMgc5dlwoVnxzjk75vv0Ng69KZ6qXAl7s2FNxtmTaoi00bsxzkvte"

	fs := http.FileServer(http.Dir("public"))
	http.Handle("/", fs)

	// Register the route with CORS middleware
	http.HandleFunc("/create-payment-intent", corsMiddleware(handleCreatePaymentIntent))
	http.HandleFunc("/get-payment-method", corsMiddleware(handleGetPaymentMethod))

	addr := "localhost:4242"
	log.Printf("Listening on %s ...", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}

// corsMiddleware adds CORS headers to the response
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight (OPTIONS) request
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	}
}

type item struct {
	Id     string
	Amount int64
	// Quantity int64
}

func calculateOrderAmount(items []item) int64 {
	// Calculate the order total on the server to prevent
	// people from directly manipulating the amount on the client
	var total int64
  total = 0
	for _, item := range items {
		total += item.Amount
	}
	return total
}

func handleCreatePaymentIntent(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Items []item `json:"items"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("json.NewDecoder.Decode: %v", err)
		return
	}

	// Create a PaymentIntent with amount and currency
	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(calculateOrderAmount(req.Items)),
		Currency: stripe.String(string(stripe.CurrencyTHB)),
		AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
			Enabled: stripe.Bool(true),
		},
	}

	pi, err := paymentintent.New(params)
	log.Printf("pi.New: %v", pi.ClientSecret)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("pi.New: %v", err)
		return
	}

	writeJSON(w, struct {
		ClientSecret string `json:"clientSecret"`
		PaymentIntentID string `json:"paymentIntentId"`
	}{
		ClientSecret: pi.ClientSecret,
		PaymentIntentID: pi.ID,
	})
}

func handleGetPaymentMethod(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		return
	}

	// ดึง API Key จาก environment variable
	// stripe.Key = "sk_test_51QOxoF4QmAAjQ0QzRU7xd3EvUavL5UHSMYsKbHwizgnrVvMgc5dlwoVnxzjk75vv0Ng69KZ6qXAl7s2FNxtmTaoi00bsxzkvte"
	// if stripe.Key == "" {
	// 	http.Error(w, "Stripe API Key is not set", http.StatusInternalServerError)
	// 	log.Println("Stripe API Key is missing")
	// 	return
	// }

	// ดึง paymentMethodID จาก query parameter
	paymentMethodID := r.URL.Query().Get("id")
	if paymentMethodID == "" {
		http.Error(w, "Missing payment method ID", http.StatusBadRequest)
		return
	}

	log.Printf("PaymentMethodID: %s", paymentMethodID)

	// เรียก Stripe API เพื่อดึงข้อมูล Payment Method
	params := &stripe.PaymentMethodParams{};
	pm, err := paymentmethod.Get(paymentMethodID, params)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("paymentmethod.Get error: %v", err)
		return
	}

	// ส่งข้อมูล Payment Method กลับไปยัง client
	writeJSON(w, pm)
}


func writeJSON(w http.ResponseWriter, v interface{}) {
	var buf bytes.Buffer
	if err := json.NewEncoder(&buf).Encode(v); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("json.NewEncoder.Encode: %v", err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if _, err := io.Copy(w, &buf); err != nil {
		log.Printf("io.Copy: %v", err)
		return
	}
}
