import { observable, computed } from "@dependable/state";
import { debounce } from "@dependable/debounce";
import sinon from "sinon";
import { expect } from "./expect.js";

const delay = (timeout = 0) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });

const timeout = 100;

describe("debounce", () => {
  let text, debounceText;
  let subscriptionSpy;

  beforeEach(() => {
    subscriptionSpy = sinon.spy().named("subscription");
  });

  afterEach(() => {
    debounceText.unsubscribe(subscriptionSpy);
  });

  describe("with an observable", () => {
    beforeEach(() => {
      text = observable("text");
      debounceText = debounce(text, timeout);

      debounceText.subscribe(subscriptionSpy);
    });

    it("initially has the observable value", () => {
      expect(debounceText, "to equal", text);
    });

    describe("after an update", () => {
      beforeEach(() => {
        text("updated text");
      });

      it("has the previous value right after the update", () => {
        expect(debounceText, "to satisfy", "text");
      });

      describe("and there hasn't been any updates for the given timeout", () => {
        beforeEach(async () => {
          await delay(timeout + 100);
        });

        it("has the updated value", () => {
          expect(debounceText, "to equal", text);
        });

        it("calls the subscription once", () => {
          expect(subscriptionSpy, "was called times", 1);
        });
      });
    });

    describe("after multiple updates", () => {
      beforeEach(async () => {
        text("updated text");
        await delay(10);
        text("updated text again");
        await delay(10);
        text("updated text again again");
      });

      it("has the previous value right after the updates", () => {
        expect(debounceText, "to satisfy", "text");
      });

      describe("and there hasn't been any updates for the given timeout", () => {
        beforeEach(async () => {
          await delay(timeout + 100);
        });

        it("has the updated value", () => {
          expect(debounceText, "to equal", text);
        });

        it("calls the subscription once", () => {
          expect(subscriptionSpy, "was called times", 1);
        });

        describe("and the observable is updated again", () => {
          beforeEach(() => {
            text("new update");
          });

          it("has the previous value right after the updates", () => {
            expect(debounceText, "to satisfy", "updated text again again");
          });

          describe("and there hasn't been any updates for the given timeout", () => {
            beforeEach(async () => {
              await delay(timeout + 100);
            });

            it("has the updated value", () => {
              expect(debounceText, "to equal", text);
            });

            it("calls the subscription again", () => {
              expect(subscriptionSpy, "was called times", 2);
            });
          });
        });
      });
    });
  });

  describe("with an observable without subscribers", () => {
    beforeEach(() => {
      text = observable("text");
      debounceText = debounce(text, timeout);
    });

    it("initially has the observable value", () => {
      expect(debounceText, "to satisfy", "text");
    });

    describe("after an update", () => {
      beforeEach(() => {
        text("updated text");
      });

      it("has the previous value right after the update", () => {
        expect(debounceText, "to satisfy", "text");
      });

      describe("and there hasn't been any updates for the given timeout", () => {
        beforeEach(async () => {
          await delay(timeout + 100);
        });

        it("doesn't change the value", () => {
          expect(debounceText, "to satisfy", "text");
        });
      });

      describe("when subscribed", () => {
        beforeEach(() => {
          debounceText.subscribe(subscriptionSpy);
        });

        it("gets the updated value", () => {
          expect(debounceText, "to satisfy", "updated text");
        });
      });
    });
  });

  describe("with a computed", () => {
    let upperCaseText;

    beforeEach(() => {
      text = observable("text");
      upperCaseText = computed(() => text().toUpperCase());
      debounceText = debounce(upperCaseText, timeout);

      debounceText.subscribe(subscriptionSpy);
    });

    it("initially has the observable value", () => {
      expect(debounceText, "to equal", upperCaseText);
    });

    describe("after an update", () => {
      beforeEach(() => {
        text("updated text");
      });

      it("has the previous value right after the update", () => {
        expect(debounceText, "to satisfy", "TEXT");
      });

      describe("and there hasn't been any updates for the given timeout", () => {
        beforeEach(async () => {
          await delay(timeout + 100);
        });

        it("has the updated value", () => {
          expect(debounceText, "to equal", upperCaseText);
        });

        it("calls the subscription once", () => {
          expect(subscriptionSpy, "was called times", 1);
        });
      });
    });

    describe("after multiple updates", () => {
      beforeEach(async () => {
        text("updated text");
        await delay(10);
        text("updated text again");
        await delay(10);
        text("updated text again again");
      });

      it("has the previous value right after the updates", () => {
        expect(debounceText, "to satisfy", "TEXT");
      });

      describe("and there hasn't been any updates for the given timeout", () => {
        beforeEach(async () => {
          await delay(timeout + 100);
        });

        it("has the updated value", () => {
          expect(debounceText, "to equal", upperCaseText);
        });

        it("calls the subscription once", () => {
          expect(subscriptionSpy, "was called times", 1);
        });

        describe("and the observable is updated again", () => {
          beforeEach(() => {
            text("new update");
          });

          it("has the previous value right after the updates", () => {
            expect(debounceText, "to satisfy", "UPDATED TEXT AGAIN AGAIN");
          });

          describe("and there hasn't been any updates for the given timeout", () => {
            beforeEach(async () => {
              await delay(timeout + 100);
            });

            it("has the updated value", () => {
              expect(debounceText, "to equal", upperCaseText);
            });

            it("calls the subscription again", () => {
              expect(subscriptionSpy, "was called times", 2);
            });
          });
        });
      });
    });
  });

  describe("with a computed without subscribers", () => {
    let upperCaseText;

    beforeEach(() => {
      text = observable("text");
      upperCaseText = computed(() => text().toUpperCase());
      debounceText = debounce(upperCaseText, timeout);
    });

    it("initially has the observable value", () => {
      expect(debounceText, "to satisfy", "TEXT");
    });

    describe("after an update", () => {
      beforeEach(() => {
        text("updated text");
      });

      it("has the previous value right after the update", () => {
        expect(debounceText, "to satisfy", "TEXT");
      });

      describe("and there hasn't been any updates for the given timeout", () => {
        beforeEach(async () => {
          await delay(timeout + 100);
        });

        it("doesn't change the value", () => {
          expect(debounceText, "to satisfy", "TEXT");
        });
      });

      describe("when subscribed", () => {
        beforeEach(() => {
          debounceText.subscribe(subscriptionSpy);
        });

        it("gets the updated value", () => {
          expect(debounceText, "to satisfy", "UPDATED TEXT");
        });
      });
    });
  });
});
