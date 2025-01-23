import { expect } from "chai";
import nock from "nock";
import fetch from "node-fetch";

describe("User Management Page Tests", function () {
    this.timeout(5000);

    // Mock API endpoint for users
    const mockUsers = [
        { student_id: 1, first_name: "John", last_name: "Doe", email: "john@example.com", is_admin: false },
        { student_id: 2, first_name: "Jane", last_name: "Smith", email: "jane@example.com", is_admin: false },
    ];

    beforeEach(() => {
        // Mock successful API response for fetching users
        nock("https://bs-fse-2025-team9.onrender.com")
            .get("/users")
            .reply(200, mockUsers);
    });

    it("should handle API errors gracefully", async function () {
        // Mock an API error response
        nock("https://bs-fse-2025-team9.onrender.com")
            .get("/users")
            .replyWithError("Failed to fetch");

        try {
            // Simulate fetching users
            await fetch("https://bs-fse-2025-team9.onrender.com/users");
        } catch (error) {
            // Validate that the error is caught and has the expected message
            expect(error.message).to.include("Failed to fetch");
        }
    });

    it("should toggle dropdown visibility correctly", function () {
        const dropdownOpen = null;
        const userId = 1;

        // Simulate dropdown toggle
        const updatedDropdownState = dropdownOpen === userId ? null : userId;

        expect(updatedDropdownState).to.equal(userId);
    });

    it("should filter users by ID correctly", function () {
        const filteredUser = mockUsers.find((user) => user.student_id === 1);

        expect(filteredUser).to.have.property("first_name", "John");
        expect(filteredUser).to.have.property("email", "john@example.com");
    });

    it("should delete a user from the list", function () {
        const updatedUsers = mockUsers.filter((user) => user.student_id !== 1);

        expect(updatedUsers).to.have.lengthOf(1);
        expect(updatedUsers[0]).to.have.property("student_id", 2);
    });

    it("should promote a user to admin", function () {
        const userToPromote = mockUsers.find((user) => user.student_id === 1);
        userToPromote.is_admin = true;

        expect(userToPromote).to.have.property("is_admin", true);
    });

    it("should construct correct edit URL", function () {
        const username = "admin";
        const sanitizedUsername = username.endsWith("/") ? username.slice(0, -1) : username;
        const userId = 1;
        const constructedURL = `/${sanitizedUsername}/search/${userId}`;

        expect(constructedURL).to.equal("/admin/search/1");
    });
});
