# The Assignment Lifecycle — Instructor Guide

Every assignment on codePost is in exactly one **status**, shown as a colored badge in
your Assignments table. The status controls what students can see and do. You change it
by clicking the badge and picking a new status — nothing is visible to students until
you say so.

```
Draft ──▶ Visible ──▶ Preview ──▶ Published ──▶ Closed ──▶ Archived
(build)   (announce)  (hand out)  (open for      (no more    (retire)
                                   work)          submitting)
```

You don't have to use every stage — most assignments go straight from **Draft** to
**Published** — and you can move backwards at any time (for example, un-publish back to
Preview if you spot a mistake in the hand-out).

## What each status means

| Status | Students see it | Students can read the files | Students can submit | Typical use |
|---|:---:|:---:|:---:|---|
| **Draft** | ✗ | ✗ | ✗ | You're still writing it. Invisible to students. |
| **Visible** | ✓ | ✗ | ✗ | An announcement: students see the name, due date, and points on their dashboard so they can plan ahead. |
| **Preview** | ✓ | ✓ | ✗ | The hand-out is readable — students can download the files and set up their environment, but can't submit yet. |
| **Published** | ✓ | ✓ | ✓ | Open for work. Students download files and submit (submitting also requires **Allow student upload** in the assignment's settings). |
| **Closed** | ✓ | ✓ | ✗ | Submitting is over. Students still see the assignment and their own submission. |
| **Archived** | ✗ | ✗ | ✗ | Retired mid-course — disappears from student dashboards. Grades already given still count. |

A few behaviors worth knowing:

- **New assignments start as Draft.** So do cloned assignments — cloning also turns off
  student upload and clears due dates, so a copied assignment can never accept
  submissions by accident. Re-enable upload when you're ready.
- **Closed usually happens by itself.** When the submission deadline passes (including
  any late-day window you allow), a Published assignment automatically shows **Closed**
  and stops accepting submissions — you don't have to do anything. The badge shows a
  small clock icon when this happened automatically. To *reopen*, extend the due date.
  To close **early** (say, an exam window ended), set the status to Closed yourself.
- **Publishing is guarded.** codePost asks you to confirm before publishing, and
  reassures you: if grading of existing submissions is still in progress, publishing
  does **not** reveal any of it (see the next section).

## Scheduling a publish

If you want an assignment to open at an exact time (say, Friday 17:00) without you
being at a keyboard, set **Publish at** in the assignment's settings (General tab).

- The schedule only fires while the assignment is **Visible** or **Preview** — a Draft
  never publishes itself, so you can't accidentally schedule something half-written.
- The time is checked every few minutes, so the assignment opens within ~5 minutes of
  the time you set.
- Publishing (scheduled or manual) is recorded in the course audit log.

A common pattern for a big assignment:

1. **Draft** while you write it.
2. **Visible** a week or two ahead — students see it coming on their dashboard.
3. **Preview** a few days early with **Publish at** set — students read the spec and
   set up; submissions open automatically on schedule.
4. It **Closes** by itself at the deadline.

## Grades and feedback are a separate switch

The status controls the *work* — seeing the assignment, reading files, submitting.
**What students see of their grading is controlled separately by "Release feedback".**

Until you release feedback, students cannot see — no matter the status:

- their grades or your comments,
- the rubric,
- the full autograder test list, or the contents of a finalized (graded) submission.

This means you can grade at your own pace on a Published or Closed assignment, and then
reveal everything at once with one switch. (Exception: **live feedback mode**, designed
for office hours and ungraded exercises, shows feedback immediately as it's written.)

While an assignment is Published but feedback is not yet released, students *can* see
that their submission was received and its status — they just can't see inside the
grading.

## Hiding an assignment from specific sections

The **Hide from** setting (General tab) hides an assignment from students in the
sections you pick — they won't see it on their dashboard and can't open or submit to
it, regardless of status. Useful when different sections run on different schedules.

## Questions we get

**The table says Closed, but when I click it the setting says Published — which is it?**
Both, and that's intentional. Your *setting* is Published; the deadline passed, so
students can no longer submit and the badge reflects what students actually experience.
Extend the due date to reopen, or select Closed to make it permanent.

**Why can't my students see the rubric while they work?**
The rubric is part of grading, so it appears when you **release feedback**. If you want
students to see criteria up front, put them in the assignment description, or use live
feedback mode.

**I published — why can't students submit?**
Check that **Allow student upload** is on (Settings → Submission). Published makes the
assignment open; that setting says whether students upload their own work at all (some
courses upload on students' behalf, e.g. scanned exams).

**Does un-publishing delete anything?**
No. Moving backwards (Published → Preview, or anything → Draft) only changes what
students can see and do. Submissions and grades are kept.

**What do my scripts get from the API?**
Scripts read and write the assignment's `state` field
(`draft`/`visible`/`preview`/`published`/`closed`/`archived`), plus a read-only
`effectiveState` that includes the automatic close. The old `isVisible`/`isReleased`
fields are still returned for compatibility (read-only, derived from the state) —
writing them returns an error telling you to set `state` instead.
